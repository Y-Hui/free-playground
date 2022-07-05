import React, { PropsWithChildren, useCallback, useEffect, useRef } from 'react'

import { VECTOR_ERROR } from '../constant/error'
import { useKeyboardFocus } from '../context/focus'
import {
  InjectCoordinate,
  useInjectCoordinate,
} from '../context/inject_coordinate'
import KeyboardFocusContext, {
  AxisLimitHandler,
  KeyboardFocusContextRef,
} from '../keyboard_focus_context'
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
          const { x: subX } = subCoordinates || {}
          // 仅需要 x 坐标，y 坐标限制为 0
          inlineContext.current?.notify(subX ?? 0, 0)
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
