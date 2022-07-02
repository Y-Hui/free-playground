import { useCallback, useRef } from 'react'

import { useKeyboardFocus } from '../context/focus/index'
import { warn } from '../utils/warn'

export interface PointOptions {
  foo: string
  y: number
  /**
   * 触发子组件（通知该组件表示它处于激活状态）
   */
  trigger: () => void
}

export default function useFocusContext() {
  // const holderCtx = useHolder()
  const context = useKeyboardFocus()
  const { setPoint: setPointFn, removePoint } = context

  const xAxisIndex = useRef<number>()

  const setPoint = useCallback(
    (options: PointOptions) => {
      console.log('添加坐标之前')
      // if (holderCtx !== null) {
      //   return holderCtx.setPoint(options)
      // }
      console.log('添加坐标', options.foo, options.y, xAxisIndex.current)
      setPointFn({
        y: options.y,
        vector: {
          name: options.foo,
          trigger: options.trigger,
          setXAxisValue(newXValue) {
            xAxisIndex.current = newXValue
          },
        },
      })
      return () => {
        warn(`删除坐标 ${options.foo}, ${options.y}, ${xAxisIndex.current}`)
        if (typeof xAxisIndex.current !== 'number') return
        removePoint(xAxisIndex.current, options.y)
        xAxisIndex.current = undefined
        console.log('删除', options.foo, '坐标后 x 为', xAxisIndex.current)
      }
    },
    [removePoint, setPointFn],
  )

  return {
    ...context,
    setPoint,
    // xAxisIndex: holderCtx?.xCoordinate || xAxisIndex,
    xAxisIndex,
  }
}
