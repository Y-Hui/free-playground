import _ from 'lodash'
import { useCallback, useRef } from 'react'

import { SetPointOptions, useKeyboardFocus } from '../context/focus/index'
import { useHolder } from '../context/holder/ctx'

export interface PointOptions {
  x?: number
  y: number
  /**
   * 触发子组件（通知该组件表示它处于激活状态）
   */
  trigger: () => void
}

export default function useFocusContext() {
  const holderCtx = useHolder()
  const context = useKeyboardFocus()
  const {
    setPoint: setPointFn,
    insertPoint,
    removePoint,
    transform2Holder,
  } = context

  const xAxisIndex = useRef<number>()

  const index = holderCtx?.xCoordinate || xAxisIndex

  const setPoint = useCallback(
    (options: PointOptions) => {
      const point: SetPointOptions = {
        x: options.x,
        y: options.y,
        vector: {
          trigger: options.trigger,
          setXAxisValue(newXValue) {
            index.current = newXValue
          },
        },
      }
      const hasHolder = holderCtx !== null
      // 占位符已经预先占用一个 x 坐标，那么直接使用这个坐标
      if (hasHolder) {
        const { xCoordinate, setChildrenRenderState } = holderCtx
        point.x = xCoordinate.current
        if (_.isFinite(point.x)) {
          console.log('insertPoint', point.y, point.x)
          insertPoint(point as Required<SetPointOptions>)
        }
        return () => {
          console.log('removeInsertPoint', xAxisIndex.current)
          setChildrenRenderState && setChildrenRenderState(false)
          if (typeof xCoordinate.current !== 'number') return
          console.log('removeInsertPoint', point.y, xAxisIndex.current)
          // 占位符不能被删除，占位符只能被 Holder 组件自己删除。
          transform2Holder(xCoordinate.current, point.y)
        }
      }
      console.log('setPoint', point.y, point.x)
      setPointFn(point)

      return () => {
        if (typeof xAxisIndex.current !== 'number') return
        console.log('removePoint', point.y, xAxisIndex.current)
        removePoint(xAxisIndex.current, point.y)
        xAxisIndex.current = undefined
      }
    },
    [setPointFn, insertPoint, removePoint, transform2Holder, holderCtx, index],
  )

  return {
    ...context,
    setPoint,
    setChildrenRenderState: holderCtx?.setChildrenRenderState,
    xAxisIndex: index,
  }
}
