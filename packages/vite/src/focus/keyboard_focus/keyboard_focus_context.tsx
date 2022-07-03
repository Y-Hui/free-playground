import _ from 'lodash'
import React, { PropsWithChildren, useMemo, useRef } from 'react'

import { VECTOR_ERROR } from './constant/error'
import {
  KeyboardFocusCtx,
  KeyboardFocusCtxValue,
  Vector,
} from './context/focus'
import { createZombiePoint, isZombiePoint } from './utils/zombie_point'

const KeyboardFocusContext: React.FC<PropsWithChildren> = (props) => {
  const { children } = props
  /**
   * 二维笛卡尔坐标
   * 用于记录所有表单输入组件。
   */
  const coordinates = useRef<(Vector | undefined | null)[][]>([])

  const state = useMemo(() => {
    const result: KeyboardFocusCtxValue = {
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
      hidePoint(x, y) {
        const yAxis = coordinates.current[y] || []
        const target = yAxis[x]
        if (!target) return
        yAxis[x] = createZombiePoint(target)
      },
      notifyLeft(x, y) {
        if (x <= 0) return VECTOR_ERROR.X_MINIMUM
        const yAxis = coordinates.current[y]
        if (!yAxis) return VECTOR_ERROR.NOT_Y_AXIS
        const xIndex = x - 1
        const vector = yAxis[xIndex]
        if (!vector || isZombiePoint(vector)) {
          return result.notifyLeft(xIndex, y)
        }
        vector.trigger()
        return undefined
      },
      notifyRight(x, y) {
        const yAxis = coordinates.current[y]
        if (x === _.size(yAxis) - 1) return VECTOR_ERROR.X_MAXIMUM
        if (!yAxis) return VECTOR_ERROR.NOT_Y_AXIS
        const xIndex = x + 1
        const vector = yAxis[xIndex]
        if (!vector || isZombiePoint(vector)) {
          return result.notifyRight(xIndex, y)
        }
        vector.trigger()
        return undefined
      },
      notifyTop(x, y) {
        // 是否处于第一行
        if (y <= 0) return VECTOR_ERROR.Y_MINIMUM
        // 取出对应的行
        const yAxis = coordinates.current[y - 1]
        // 此行不存在
        if (!yAxis) return VECTOR_ERROR.NOT_Y_AXIS
        // 目标行中没有坐标点
        if (_.isEmpty(yAxis)) return VECTOR_ERROR.EMPTY
        // 目标坐标点
        const vector = yAxis[x]
        // 对应坐标点为 undefined（通常为坐标不对齐导致，比如第一行三个，第二行两个）
        if (!vector || isZombiePoint(vector)) {
          // 坐标点向上位移一个单位
          return result.notifyTop(x, y - 1)
        }
        vector.trigger()
        return undefined
      },
      notifyBottom(x, y) {
        // 是否处于最后一行
        if (y === _.size(coordinates.current) - 1) return VECTOR_ERROR.Y_MAXIMUM
        // 取出对应的行
        const yAxis = coordinates.current[y + 1]
        // 此行不存在
        if (!yAxis) return VECTOR_ERROR.NOT_Y_AXIS
        // 目标行中没有坐标点
        if (_.isEmpty(yAxis)) return VECTOR_ERROR.EMPTY
        // 目标坐标点
        const vector = yAxis[x]
        // 对应坐标点为 undefined（通常为坐标不对齐导致，比如第一行三个，第二行两个）
        if (!vector || isZombiePoint(vector)) {
          // 坐标点向下移一个单位
          return result.notifyBottom(x, y + 1)
        }
        vector.trigger()
        return undefined
      },
    }
    return result
  }, [])

  return (
    <KeyboardFocusCtx.Provider value={state}>
      {children}
    </KeyboardFocusCtx.Provider>
  )
}

KeyboardFocusContext.displayName = 'KeyboardFocusContext'

export default KeyboardFocusContext
