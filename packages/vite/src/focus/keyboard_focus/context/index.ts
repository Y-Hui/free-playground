import _ from 'lodash'
import { createContext, useContext } from 'react'

type ValueOf<T> = T[keyof T]

export const VECTOR_ERROR = {
  /** 对应 X 坐标不存在 */
  NOT_X_AXIS: 'NOT_X_AXIS',
  /** 对应 Y 坐标不存在 */
  NOT_Y_AXIS: 'NOT_Y_AXIS',
  /** 目前处于 X 轴极大值 */
  X_MAXIMUM: 'X_MAXIMUM',
  /** 目前处于 Y 轴极大值 */
  Y_MAXIMUM: 'Y_MAXIMUM',
  /** 目前处于 X 轴极小值 */
  X_MINIMUM: 'X_MINIMUM',
  /** 目前处于 Y 轴极小值 */
  Y_MINIMUM: 'Y_MINIMUM',
  /** 对应 Y 轴中没有坐标点 */
  EMPTY: 'EMPTY',
} as const

export type VectorError = ValueOf<typeof VECTOR_ERROR>

export interface Vector {
  /**
   * 触发子组件（通知该组件表示它处于激活状态）
   */
  trigger: () => void
  /**
   * x 轴坐标值需要更新时调用
   */
  setXAxisValue: (x: number) => void
}

export interface SetPointOptions {
  x?: number
  y: number
  vector: Vector
}

export interface SetPointHolderOptions {
  x?: number
  y: number
  /**
   * x 轴坐标值需要更新时调用
   */
  setXAxisValue: (x: number) => void
}

export interface KeyboardFocusCtxValue {
  /**
   * 设置坐标点，需要 y 坐标，x 坐标会自动生成
   */
  setPoint: (options: SetPointOptions) => void
  /**
   * 设置坐标占位符
   */
  setPointHolder: (options: SetPointHolderOptions) => void
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
