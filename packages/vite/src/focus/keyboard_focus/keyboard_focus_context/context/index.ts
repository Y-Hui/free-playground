import _ from 'lodash'
import { createContext, MutableRefObject, useContext } from 'react'

import type { VectorError } from '../../constant/error'

/**
 * 子坐标
 * 适用于 Table 中，一个单元格对应多个需要焦点的组件
 */
export interface SubCoordinates {
  x?: number
  y?: number
  /**
   * 按键来源（表示用户按下的是哪一个按键才通知焦点组件）
   */
  keySource?: string
}

export interface Vector {
  /**
   * 触发子组件（通知该组件表示它处于激活状态）
   */
  trigger: (subCoordinates?: SubCoordinates) => void
}

export interface SetPointOptions {
  x: number
  y: number
  vector: Vector
}

/**
 * notify**** 函数会把当前的 x,y 坐标作为子坐标通过 onAxisLimit 传递出去。
 * 这个 x,y 值，仅在 DistributionFocus 组件中才有意义
 */
export interface KeyboardFocusCtxValue {
  /**
   * 坐标数据
   */
  coordinates: MutableRefObject<(Vector | undefined | null)[][]>
  /**
   * 设置坐标点，需要 y 坐标，x 坐标会自动生成
   *
   * 返回值是一个函数，用于隐藏坐标点
   */
  setPoint: (options: SetPointOptions) => () => void
  /**
   * 通知对应的坐标点
   */
  notify: (x: number, y: number) => VectorError | void
  /**
   * 通知左侧的组件
   */
  notifyLeft: (
    x: number,
    y: number,
    subCoordinates?: SubCoordinates,
  ) => VectorError | void
  /**
   * 通知右侧的组件
   */
  notifyRight: (
    x: number,
    y: number,
    subCoordinates?: SubCoordinates,
  ) => VectorError | void
  /**
   * 通知上方的组件
   */
  notifyTop: (
    x: number,
    y: number,
    subCoordinates?: SubCoordinates,
  ) => VectorError | void
  /**
   * 通知下方的组件
   */
  notifyBottom: (
    x: number,
    y: number,
    subCoordinates?: SubCoordinates,
  ) => VectorError | void
  /**
   * 通知 x 轴最后一个组件
   */
  notifyXAxisLast: (
    y: number,
    subCoordinates?: SubCoordinates,
  ) => VectorError | void
}

const KeyboardFocusCtx = createContext<KeyboardFocusCtxValue | null>(null)

function useKeyboardFocus() {
  const ctx = useContext(KeyboardFocusCtx)
  if (_.isNil(ctx)) {
    throw new Error(
      `useKeyboardFocus must be inserted into <KeyboardFocusCtx.Provider />`,
    )
  }
  return ctx
}

export { KeyboardFocusCtx, useKeyboardFocus }
