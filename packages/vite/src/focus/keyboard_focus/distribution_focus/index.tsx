import _ from 'lodash'
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react'

import { VECTOR_ERROR } from '../constant/error'
import { InjectCoordinate, useInjectCoordinate } from '../inject_coordinate'
import KeyboardFocusContext, {
  ErrorHandler,
  KeyboardFocusContextRef,
} from '../keyboard_focus_context'
import { useKeyboardFocus } from '../keyboard_focus_context/context'
import { isNumber } from '../utils'

interface DistributionFocusProps {
  x?: number
  y?: number
  /**
   * 自定义模式
   *
   * @default "x"
   */
  mode?: 'x' | 'y'
}

/**
 * 将一个焦点进行分发。
 *
 * 场景举例：在 Table 中，一个单元格视为一个焦点，如果单元格中存在对应多个需要焦点的组件，
 * 此时，便需要对焦点进行分发。
 *
 * 此组件的原理大致是这样：
 * 在一个单元格内，维护一套焦点管理系统，可以类比为现实生活中的 “路由器”。
 * 注意：在本组内通知其他焦点组件时会将 y 轴永远强制为 0。
 */
const DistributionFocus: React.FC<PropsWithChildren<DistributionFocusProps>> = (
  props,
) => {
  const { x: rawX, y: rawY, mode = 'x', children } = props
  const { setPoint, dispatch } = useKeyboardFocus()
  const [x, y] = useInjectCoordinate(rawX, rawY)

  const inlineContext = useRef<KeyboardFocusContextRef>(null)

  const checkDisabledAll = useCallback(() => {
    return _.every(inlineContext.current?.coordinates.current, (row) => {
      return row.every((item) => !item || item.disabled)
    })
  }, [])

  const removePoint = useRef<() => void>()
  useEffect(
    () => () => {
      removePoint.current && removePoint.current()
    },
    [],
  )

  useEffect(() => {
    if (!isNumber(x) || !isNumber(y)) return
    removePoint.current = setPoint({
      x,
      y,
      vector: {
        blur() {
          if (!inlineContext.current) return
          inlineContext.current.triggerBlur()
        },
        trigger(focusFrom) {
          if (!inlineContext.current) return
          const { subX: fromX, subY, keyName, type } = focusFrom || {}
          if (checkDisabledAll()) {
            dispatch({
              currentX: x,
              currentY: y,
              keyName,
              subX: fromX,
              subY,
              type,
            })
            return
          }
          const maxX = _.size(inlineContext.current?.coordinates.current[0]) - 1
          // const maxY = _.size(inlineContext.current?.coordinates.current) - 1
          const xIndex = Math.min(fromX ?? 0, maxX)

          // 判断由哪个按键进入此坐标轴
          switch (keyName) {
            case 'ArrowLeft': {
              inlineContext.current.notifyXAxisLast(0, focusFrom)
              break
            }
            case 'ArrowRight': {
              inlineContext.current.notifyFirst(0, focusFrom)
              break
            }
            case 'ArrowUp': {
              if (mode === 'y') {
                // 跳到 y 轴最后一个
                inlineContext.current.notifyYLast(0, focusFrom)
              } else {
                inlineContext.current.notify(xIndex, 0, focusFrom)
              }
              break
            }
            case 'ArrowDown': {
              if (mode === 'y') {
                // 跳到 y 轴第一个
                inlineContext.current.notifyYFirst(0, focusFrom)
              } else {
                inlineContext.current.notify(xIndex, 0, focusFrom)
              }
              break
            }
            /*
                        case 'ArrowUp': {
              // 跳到 y 轴最后一个
              inlineContext.current.notifyFirst(maxY, focusFrom)
              break
            }
            case 'ArrowDown': {
              inlineContext.current.notifyFirst(0, focusFrom)
              // inlineContext.current.notify(xIndex, 0, focusFrom)
              break
            }
            */
            // no default
          }
        },
      },
    })
  }, [checkDisabledAll, dispatch, setPoint, x, y, mode])

  const onError: ErrorHandler = useCallback(
    (error, focusFrom) => {
      if (!isNumber(x) || !isNumber(y)) return
      switch (error) {
        case VECTOR_ERROR.X_MINIMUM:
        case VECTOR_ERROR.X_MAXIMUM:
        case VECTOR_ERROR.Y_MINIMUM:
        case VECTOR_ERROR.Y_MAXIMUM:
        case VECTOR_ERROR.DISABLED: {
          const { subX, subY } = focusFrom || {}
          dispatch({
            currentX: x,
            currentY: y,
            subX: subX ?? focusFrom.x,
            subY: subY ?? focusFrom.y,
            keyName: focusFrom.keyName,
            type: focusFrom.type,
          })
          break
        }
        default:
          console.error('[DistributionFocus]: unhandled behavior.', error)
      }
    },
    [dispatch, x, y],
  )

  const injectValue = useMemo(() => {
    switch (mode) {
      case 'y':
        return '[0, null]'
      case 'x':
        return '[null, 0]'
      default:
        return '[]'
    }
  }, [mode])

  return (
    <InjectCoordinate.Provider value={injectValue}>
      <KeyboardFocusContext ref={inlineContext} onError={onError}>
        {children}
      </KeyboardFocusContext>
    </InjectCoordinate.Provider>
  )
}

export default DistributionFocus
