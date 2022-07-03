import _ from 'lodash'
import React, { createContext, MutableRefObject, useContext } from 'react'

import type { VectorError } from '../../constant/error'

export interface Vector {
  key: React.Key
  /**
   * 触发子组件（通知该组件表示它处于激活状态）
   */
  trigger: () => void
  /**
   * x 轴坐标值需要更新时调用
   */
  setXAxisValue: (x?: number) => void
}

export interface SetPointOptions {
  x?: number
  y: number
  vector: Vector
}

export interface KeyboardFocusCtxValue {
  forceRenderDep: MutableRefObject<number>
  /**
   * 强制更新
   */
  forceRenderValue: number
  /**
   * 将坐标点转换为占位符
   */
  transform2Holder: (x: number, y: number) => void
  /**
   * 设置坐标点，需要 y 坐标，x 坐标会自动生成
   */
  setPoint: (options: SetPointOptions) => void
  /**
   * 替换坐标点
   */
  replacePoint: (x: number, y: number, vector: Vector) => void
  /**
   * 设置坐标占位符
   */
  setPointHolder: (options: SetPointOptions) => void
  /**
   * 删除坐标点
   */
  removePoint: (x: number, y: number) => void
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
