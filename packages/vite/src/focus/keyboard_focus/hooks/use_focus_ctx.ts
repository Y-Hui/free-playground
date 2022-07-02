import _ from 'lodash'
import { useCallback, useRef } from 'react'

import { SetPointOptions, useKeyboardFocus } from '../context/focus/index'
import { useHolder } from '../context/holder/ctx'
import { warn } from '../utils/warn'

export interface PointOptions {
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
      console.log('添加坐标', options.y, xAxisIndex.current)
      setPointFn({
        y: options.y,
        vector: {
          trigger: options.trigger,
          setXAxisValue(newXValue) {
            xAxisIndex.current = newXValue
          },
        },
      })
      return () => {
        warn(`删除坐标, ${options.y}, ${xAxisIndex.current}`)
        if (typeof xAxisIndex.current !== 'number') return
        removePoint(xAxisIndex.current, options.y)
        xAxisIndex.current = undefined
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
