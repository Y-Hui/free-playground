import _ from 'lodash'
import React, { PropsWithChildren, useMemo, useRef } from 'react'

import {
  KeyboardFocusCtx,
  KeyboardFocusCtxValue,
  Vector,
  VECTOR_ERROR,
} from './context'

/** 坐标占位符，当坐标被删除时或者预先占位时使用 */
const ZOMBIE_POINT = Symbol('ZOMBIE_POINT')
type ZombiePoint = typeof ZOMBIE_POINT

const KeyboardFocusContext: React.FC<PropsWithChildren> = (props) => {
  const { children } = props
  /**
   * 二维笛卡尔坐标
   * 用于记录所有表单输入组件。
   */
  const coordinates = useRef<(Vector | ZombiePoint)[][]>([])

  const state = useMemo(() => {
    const result: KeyboardFocusCtxValue = {
      setPoint(options) {
        // console.log(JSON.stringify(options))
        const { x, y, vector } = options
        const yAxis = coordinates.current[y] || []
        let index: number
        if (!_.isNil(x) && _.isFinite(x)) {
          index = x
          yAxis[x] = vector
        } else {
          index = yAxis.push(vector) - 1
        }
        coordinates.current[y] = yAxis
        vector.setXAxisValue(index)
      },
      setPointHolder(options) {
        const { x, y, setXAxisValue } = options
        const yAxis = coordinates.current[y] || []
        let index: number
        if (!_.isNil(x) && _.isFinite(x)) {
          index = x
          yAxis[x] = ZOMBIE_POINT
        } else {
          index = yAxis.push(ZOMBIE_POINT) - 1
        }
        coordinates.current[y] = yAxis
        setXAxisValue(index)
      },
      removePoint(x, y) {
        const yAxis = coordinates.current[y]
        if (!yAxis) return
        yAxis[x] = ZOMBIE_POINT
      },
      notifyLeft(x, y) {
        if (x <= 0) return VECTOR_ERROR.X_MINIMUM
        const yAxis = coordinates.current[y]
        if (!yAxis) return VECTOR_ERROR.NOT_Y_AXIS
        const xIndex = x - 1
        const vector = yAxis[xIndex]
        if (!vector) return VECTOR_ERROR.NOT_X_AXIS
        if (vector === ZOMBIE_POINT) {
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
        if (!vector) return VECTOR_ERROR.NOT_X_AXIS
        if (vector === ZOMBIE_POINT) {
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
        if (!vector || vector === ZOMBIE_POINT) {
          // 坐标点向上位移一个单位
          return result.notifyLeft(x, y - 1)
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
        if (!vector || vector === ZOMBIE_POINT) {
          // 坐标点向下移一个单位
          return result.notifyLeft(x, y + 1)
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

export default KeyboardFocusContext
