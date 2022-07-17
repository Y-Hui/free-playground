import React, {
  forwardRef,
  PropsWithChildren,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useLatest } from 'react-use'

import { VectorError } from '../constant/error'
import { KeyboardFocusCtx, KeyboardFocusCtxValue } from './context'
import {
  Coordinates,
  FocusFrom,
  DispatchFn,
  FocusVectorOptions,
} from '../types'
import normalDispatch from '../dispatch_strategy'
import { getVector, getFirstVector, getLastVector } from '../utils'

export type KeyboardFocusContextRef = KeyboardFocusCtxValue
export type ErrorHandler = (type: VectorError, focusForm: FocusFrom) => void
export type FocusedHandler = (x: number, y: number) => void

export interface KeyboardFocusContextProps {
  /**
   * 焦点调度策略
   */
  dispatch?: DispatchFn
  /**
   * 错误处理
   */
  onError?: ErrorHandler
  /**
   * 当一个组件处于焦点后触发 (仅支持由方向键触发的焦点，而不是使用鼠标、tab 键触发的焦点)
   */
  onFocused?: FocusedHandler
}

const KeyboardFocusContext = forwardRef<
  KeyboardFocusContextRef,
  PropsWithChildren<KeyboardFocusContextProps>
>((props, ref) => {
  const { onError, onFocused, dispatch = normalDispatch, children } = props

  const schedule = useLatest(dispatch)

  const handleErrorRef = useLatest(onError)
  const handleError: ErrorHandler = useCallback(
    (type, focusFrom) => {
      const handler = handleErrorRef.current
      if (typeof handler !== 'function') return
      handler(type, focusFrom)
    },
    [handleErrorRef],
  )

  const handleFocusedRef = useLatest(onFocused)
  const handleFocused: FocusedHandler = useCallback(
    (x, y) => {
      const handler = handleFocusedRef.current
      if (typeof handler !== 'function') return
      handler(x, y)
    },
    [handleFocusedRef],
  )

  /**
   * 二维笛卡尔坐标
   * 用于记录所有表单输入组件。
   */
  const coordinates = useRef<Coordinates>([])
  /**
   * key 为 x,y
   * value 为函数
   */
  const [blurFnMap] = useState(
    () => new Map<string, (() => void) | undefined>(),
  )

  const onBlur = useCallback(
    (skipX?: number, skipY?: number) => {
      const skipKey = `${skipX},${skipY}`
      const isValid = typeof skipX === 'number' && typeof skipY === 'number'
      blurFnMap.forEach((blur, key) => {
        if (isValid && skipKey === key) return
        blur && blur()
      })
    },
    [blurFnMap],
  )

  const onFocus = useCallback(
    (options: FocusVectorOptions) => {
      const { x, y, vector, from } = options
      onBlur(x, y)
      vector.trigger(from)
      handleFocused(x, y)
    },
    [handleFocused, onBlur],
  )

  const state = useMemo(() => {
    const result: KeyboardFocusCtxValue = {
      coordinates,
      focusVector: onFocus,
      dispatch(opts) {
        schedule.current(
          {
            coordinates: coordinates.current,
            focus: onFocus,
            throwError(options) {
              handleError(options.error, options.from)
            },
          },
          opts,
        )
      },
      setPoint(options) {
        const { x, y, vector } = options
        const yAxis = coordinates.current[y] || []
        yAxis[x] = vector
        coordinates.current[y] = yAxis
        blurFnMap.set(`${x},${y}`, vector.blur)
        return () => {
          const _yAxis = coordinates.current[y] || []
          _yAxis[x] = undefined
          coordinates.current[y] = _yAxis
          blurFnMap.delete(`${x},${y}`)
        }
      },
      notifyXAxisLast(y, focusForm) {
        const {
          err,
          x: targetX,
          y: targetY,
          value,
        } = getLastVector(coordinates.current, y)
        if (err) {
          handleError(err, focusForm)
          return
        }
        onFocus({
          x: targetX,
          y: targetY,
          vector: value,
          from: focusForm,
        })
      },
      notify(x, y, focusForm) {
        const {
          err,
          x: targetX,
          y: targetY,
          value,
        } = getVector(coordinates.current, x, y)
        if (err) {
          handleError(err, focusForm)
          return
        }
        onFocus({
          x: targetX,
          y: targetY,
          vector: value,
          from: focusForm,
        })
      },
      notifyFirst(y, focusForm) {
        const {
          err,
          x: targetX,
          y: targetY,
          value,
        } = getFirstVector(coordinates.current, y)
        if (err) {
          handleError(err, focusForm)
          return
        }
        onFocus({
          x: targetX,
          y: targetY,
          vector: value,
          from: focusForm,
        })
      },
      onFocused: handleFocused,
      triggerBlur: () => onBlur(),
    }
    return result
  }, [blurFnMap, handleError, handleFocused, onBlur, onFocus, schedule])

  useImperativeHandle(ref, () => state, [state])

  return (
    <KeyboardFocusCtx.Provider value={state}>
      {children}
    </KeyboardFocusCtx.Provider>
  )
})

KeyboardFocusContext.displayName = 'KeyboardFocus'

export default KeyboardFocusContext
