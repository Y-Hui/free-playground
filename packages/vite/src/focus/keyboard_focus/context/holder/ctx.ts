import { createContext, MutableRefObject, useContext } from 'react'

export interface PointOptions {
  y: number
  /**
   * 触发子组件（通知该组件表示它处于激活状态）
   */
  trigger: () => void
}

export interface HolderCtxValue {
  /**
   * 占位符 x 坐标
   */
  xCoordinate: MutableRefObject<number | undefined>
  /**
   * 子组件是否已经渲染
   */
  setChildrenRenderState: (isRender?: boolean) => void
  setPoint: (options: PointOptions) => () => void
}

export const HolderCtx = createContext<HolderCtxValue | null>(null)

export function useHolder() {
  return useContext(HolderCtx)
}
