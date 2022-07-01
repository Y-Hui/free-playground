import { useCallback, useRef } from 'react'

import { useHolder } from '../context/holder'
import { useKeyboardFocus } from '../context/index'

export interface SetPointOptions {
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
  const { setPoint: setPointFn } = context

  const xAxisIndex = useRef<number>()

  const index = holderCtx?.xCoordinate || xAxisIndex

  const setPoint = useCallback(
    (options: SetPointOptions) => {
      let { x } = options
      // 占位符已经预先占用一个 x 坐标，那么直接使用这个坐标
      if (holderCtx !== null) {
        x = holderCtx.xCoordinate.current
      }
      setPointFn({
        x,
        y: options.y,
        vector: {
          trigger: options.trigger,
          setXAxisValue(newXValue) {
            index.current = newXValue
          },
        },
      })
    },
    [setPointFn, holderCtx, index],
  )

  return {
    ...context,
    setPoint,
    setChildrenRenderState: holderCtx?.setChildrenRenderState,
    xAxisIndex: index,
  }
}
