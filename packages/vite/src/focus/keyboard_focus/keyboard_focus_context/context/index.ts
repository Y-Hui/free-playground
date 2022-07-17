import _ from 'lodash'
import { createContext, MutableRefObject, useContext } from 'react'

import {
  DispatchOptions,
  Vector,
  FocusVectorOptions,
  FocusFrom,
} from '../../types'

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
  notify: (x: number, y: number, focusFrom: FocusFrom) => void
  /**
   * 通知 x 轴最后一个组件
   */
  notifyXAxisLast: (y: number, focusFrom: FocusFrom) => void
  /**
   * 通知 x 轴第一个组件
   */
  notifyFirst: (y: number, focusFrom: FocusFrom) => void
  /**
   * 当一个组件处于焦点后触发
   */
  onFocused: (x: number, y: number) => void
  /**
   * 触发所有坐标的 blur 函数。
   */
  triggerBlur: () => void
  /**
   * 激活对应坐标
   */
  focusVector: (options: FocusVectorOptions) => void
  /**
   * 焦点派发，在按下键盘按键时调用
   */
  dispatch: (options: DispatchOptions) => void
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
