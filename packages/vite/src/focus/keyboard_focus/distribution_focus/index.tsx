import _ from 'lodash'
import React, { PropsWithChildren, useCallback, useEffect, useRef } from 'react'

import { VECTOR_ERROR } from '../constant/error'
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
  const { setPoint, notifyLeft, notifyRight, notifyTop, notifyBottom } =
    useKeyboardFocus()
  const [x, y] = useInjectCoordinate()

  const inlineContext = useRef<KeyboardFocusContextRef>(null)

  useEffect(() => {
    if (!isNumber(x) || !isNumber(y)) return undefined
    return setPoint({
      x,
      y,
      vector: {
        trigger(subCoordinates) {
          const { x: subX, keySource } = subCoordinates || {}
          // 判断是点击左方向键触发的焦点，
          // 则表示现在的焦点是在当前组件的右侧，则应该把焦点放在 x 轴最后一个组件
          // 而不是第一个
          switch (keySource) {
            case 'ArrowLeft':
              inlineContext.current?.notifyXAxisLast(0)
              return
            case 'ArrowRight':
              inlineContext.current?.notify(0, 0)
              return
            // no default
          }
          // 仅需要 x 坐标，y 坐标限制为 0
          // 设置焦点在第一个组件上
          const maxX = _.size(inlineContext.current?.coordinates.current[0]) - 1
          inlineContext.current?.notify(Math.min(subX ?? 0, maxX), 0)
        },
      },
    })
  }, [setPoint, x, y])

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
