import _ from 'lodash'
import React, { PropsWithChildren, useCallback, useEffect, useRef } from 'react'

import { VECTOR_ERROR, VectorError } from '../constant/error'
import { InjectCoordinate, useInjectCoordinate } from '../inject_coordinate'
import KeyboardFocusContext, {
  AxisLimitHandler,
  KeyboardFocusContextRef,
} from '../keyboard_focus_context'
import { useKeyboardFocus } from '../keyboard_focus_context/context'
import isNumber from '../utils/is_number'

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
const DistributionFocus: React.FC<PropsWithChildren> = (props) => {
  const { children } = props
  const {
    setPoint,
    notifyLeft,
    notifyRight,
    notifyTop,
    notifyBottom,
    onFocus,
  } = useKeyboardFocus()
  const [x, y] = useInjectCoordinate()

  const inlineContext = useRef<KeyboardFocusContextRef>(null)

  useEffect(() => {
    if (!isNumber(x) || !isNumber(y)) return undefined
    return setPoint({
      x,
      y,
      vector: {
        trigger(subCoordinates) {
          if (!inlineContext.current) return
          const { x: subX, keySource } = subCoordinates || {}
          const maxX = _.size(inlineContext.current?.coordinates.current[0]) - 1
          const xIndex = Math.min(subX ?? 0, maxX)
          let result: VectorError | void
          // 判断由哪个按键进入此坐标轴
          switch (keySource) {
            case 'ArrowLeft': {
              inlineContext.current.notifyXAxisLast(0)
              break
            }
            case 'ArrowRight': {
              result = inlineContext.current?.notify(0, 0)
              if (result === VECTOR_ERROR.DISABLED) {
                result = inlineContext.current.notifyRight(0, 0)
              }
              break
            }
            case 'ArrowUp': {
              result = inlineContext.current.notify(xIndex, 0)
              if (result === VECTOR_ERROR.DISABLED) {
                result = notifyTop(x, y, subCoordinates)
              }
              break
            }
            case 'ArrowDown': {
              result = inlineContext.current?.notify(xIndex, 0)
              if (result === VECTOR_ERROR.DISABLED) {
                result = notifyBottom(x, y, subCoordinates)
              }
            }
            // no default
          }
          if (result === undefined) {
            onFocus(x, y)
          }
        },
      },
    })
  }, [notifyBottom, notifyTop, onFocus, setPoint, x, y])

  const onAxisLimit: AxisLimitHandler = useCallback(
    (limitType, subCoordinates) => {
      if (!isNumber(x) || !isNumber(y)) return
      switch (limitType) {
        case VECTOR_ERROR.X_MINIMUM:
          notifyLeft(x, y, subCoordinates)
          break
        case VECTOR_ERROR.X_MAXIMUM:
          notifyRight(x, y, subCoordinates)
          break
        case VECTOR_ERROR.Y_MINIMUM:
          notifyTop(x, y, subCoordinates)
          break
        case VECTOR_ERROR.Y_MAXIMUM:
          notifyBottom(x, y, subCoordinates)
          break
        default:
          console.error('[DistributionFocus]: unhandled behavior.')
      }
    },
    [notifyBottom, notifyLeft, notifyRight, notifyTop, x, y],
  )

  return (
    <InjectCoordinate.Provider value="[null, 0]">
      <KeyboardFocusContext ref={inlineContext} onAxisLimit={onAxisLimit}>
        {children}
      </KeyboardFocusContext>
    </InjectCoordinate.Provider>
  )
}

export default DistributionFocus
