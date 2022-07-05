import _ from 'lodash'
import React, {
  forwardRef,
  PropsWithChildren,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react'
import { useLatest } from 'react-use'

import { LimitError, VECTOR_ERROR } from '../constant/error'
import {
  KeyboardFocusCtx,
  KeyboardFocusCtxValue,
  SubCoordinates,
  Vector,
} from './context'

export type KeyboardFocusContextRef = KeyboardFocusCtxValue

export type AxisLimitHandler = (
  type: LimitError,
  subCoordinates?: SubCoordinates,
) => void

export interface KeyboardFocusContextProps {
  /**
   * 到达某条轴的极限（极大或极小）
   */
  onAxisLimit?: AxisLimitHandler
}

const KeyboardFocusContext = forwardRef<
  KeyboardFocusContextRef,
  PropsWithChildren<KeyboardFocusContextProps>
>((props, ref) => {
  const { onAxisLimit, children } = props

  const handleAxisLimitRef = useLatest(onAxisLimit)

  const handleAxisLimit: AxisLimitHandler = useCallback(
    (type, subCoordinates) => {
      const handler = handleAxisLimitRef.current
      if (typeof handler !== 'function') return
      handler(type, subCoordinates)
    },
    [handleAxisLimitRef],
  )

  /**
   * 二维笛卡尔坐标
   * 用于记录所有表单输入组件。
   */
  const coordinates = useRef<(Vector | undefined | null)[][]>([])

  const state = useMemo(() => {
    const result: KeyboardFocusCtxValue = {
      coordinates,
      setPoint(options) {
        const { x, y, vector } = options
        const yAxis = coordinates.current[y] || []
        yAxis[x] = vector
        coordinates.current[y] = yAxis
        return () => {
          const _yAxis = coordinates.current[y] || []
          _yAxis[x] = undefined
          coordinates.current[y] = _yAxis
        }
      },
      notifyLeft(x, y, subCoordinates) {
        if (x <= 0) {
          handleAxisLimit(VECTOR_ERROR.X_MINIMUM, { x, y })
          return VECTOR_ERROR.X_MINIMUM
        }
        const yAxis = coordinates.current[y]
        if (!yAxis) return VECTOR_ERROR.NOT_Y_AXIS
        const xIndex = x - 1
        const vector = yAxis[xIndex]
        if (!vector) {
          return result.notifyLeft(xIndex, y, {
            x: xIndex,
            y,
            keySource: subCoordinates?.keySource,
          })
        }
        vector.trigger(subCoordinates)
        return undefined
      },
      notifyRight(x, y, subCoordinates) {
        const yAxis = coordinates.current[y]
        if (x === _.size(yAxis) - 1) {
          handleAxisLimit(VECTOR_ERROR.X_MAXIMUM, { x, y })
          return VECTOR_ERROR.X_MAXIMUM
        }
        if (!yAxis) return VECTOR_ERROR.NOT_Y_AXIS
        const xIndex = x + 1
        const vector = yAxis[xIndex]
        if (!vector) {
          return result.notifyRight(xIndex, y, {
            x: xIndex,
            y,
            keySource: subCoordinates?.keySource,
          })
        }
        vector.trigger(subCoordinates)
        return undefined
      },
      notifyTop(x, y, subCoordinates) {
        // 是否处于第一行
        if (y <= 0) {
          handleAxisLimit(VECTOR_ERROR.Y_MINIMUM, { x, y })
          return VECTOR_ERROR.Y_MINIMUM
        }
        // 取出对应的行
        const yAxis = coordinates.current[y - 1]
        // 此行不存在
        if (!yAxis) return VECTOR_ERROR.NOT_Y_AXIS
        // 目标行中没有坐标点
        if (_.isEmpty(yAxis)) return VECTOR_ERROR.EMPTY
        // 目标坐标点
        const vector = yAxis[x]
        // 对应坐标点为 undefined（通常为坐标不对齐导致，比如第一行三个，第二行两个）
        if (!vector) {
          // 坐标点向上位移一个单位
          return result.notifyTop(x, y - 1, {
            x,
            y: y - 1,
            keySource: subCoordinates?.keySource,
          })
        }
        vector.trigger(subCoordinates)
        return undefined
      },
      notifyBottom(x, y, subCoordinates) {
        // 是否处于最后一行
        if (y === _.size(coordinates.current) - 1) {
          handleAxisLimit(VECTOR_ERROR.Y_MAXIMUM, { x, y })
          return VECTOR_ERROR.Y_MAXIMUM
        }
        // 取出对应的行
        const yAxis = coordinates.current[y + 1]
        // 此行不存在
        if (!yAxis) return VECTOR_ERROR.NOT_Y_AXIS
        // 目标行中没有坐标点
        if (_.isEmpty(yAxis)) return VECTOR_ERROR.EMPTY
        // 目标坐标点
        const vector = yAxis[x]
        // 对应坐标点为 undefined（通常为坐标不对齐导致，比如第一行三个，第二行两个）
        if (!vector) {
          // 坐标点向下移一个单位
          return result.notifyBottom(x, y + 1, {
            x,
            y: y + 1,
            keySource: subCoordinates?.keySource,
          })
        }
        vector.trigger(subCoordinates)
        return undefined
      },
      notifyXAxisLast(y, subCoordinates) {
        // 取出对应的行
        const yAxis = coordinates.current[y]
        // 此行不存在
        if (!yAxis) return VECTOR_ERROR.NOT_Y_AXIS
        // 目标行中没有坐标点
        if (_.isEmpty(yAxis)) return VECTOR_ERROR.EMPTY
        // 目标坐标点
        const vector = yAxis[yAxis.length - 1]
        // 对应坐标点为 undefined（通常为坐标不对齐导致，比如第一行三个，第二行两个）
        if (!vector) {
          return VECTOR_ERROR.NOT_X_AXIS
        }
        vector.trigger(subCoordinates)
        return undefined
      },
      notify(x, y) {
        // 取出对应的行
        const yAxis = coordinates.current[y]
        // 此行不存在
        if (!yAxis) return VECTOR_ERROR.NOT_Y_AXIS
        // 目标行中没有坐标点
        if (_.isEmpty(yAxis)) return VECTOR_ERROR.EMPTY
        // 目标坐标点
        const vector = yAxis[x]
        // 对应坐标点为 undefined（通常为坐标不对齐导致，比如第一行三个，第二行两个）
        if (!vector) {
          return VECTOR_ERROR.NOT_X_AXIS
        }
        vector.trigger()
        return undefined
      },
    }
    return result
  }, [handleAxisLimit])

  useImperativeHandle(ref, () => state, [state])

  return (
    <KeyboardFocusCtx.Provider value={state}>
      {children}
    </KeyboardFocusCtx.Provider>
  )
})

KeyboardFocusContext.displayName = 'KeyboardFocusContext'

export default KeyboardFocusContext
