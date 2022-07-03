import _ from 'lodash'
import { createContext, useContext } from 'react'

import type { VectorError } from '../../constant/error'

export interface Vector {
  /**
   * 触发子组件（通知该组件表示它处于激活状态）
   */
  trigger: () => void
}

export interface SetPointOptions {
  x: number
  y: number
  vector: Vector
}

export interface KeyboardFocusCtxValue {
  /**
   * 设置坐标点，需要 y 坐标，x 坐标会自动生成
   *
   * 返回值是一个函数，用于隐藏坐标点
   */
  setPoint: (options: SetPointOptions) => () => void
  /**
   * 隐藏坐标点（标记为不可见，焦点切换时将直接跳过）
   */
  hidePoint: (x: number, y: number) => void
  /**
   * 通知左侧的组件
   */
  notifyLeft: (x: number, y: number) => VectorError | void
  /**
   * 通知右侧的组件
   */
  notifyRight: (x: number, y: number) => VectorError | void
  /**
   * 通知上方的组件
   */
  notifyTop: (x: number, y: number) => VectorError | void
  /**
   * 通知下方的组件
   */
  notifyBottom: (x: number, y: number) => VectorError | void
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
