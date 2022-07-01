import { createContext, MutableRefObject, useContext } from 'react'

export interface HolderCtxValue {
  /**
   * 占位符 x 坐标
   */
  xCoordinate: MutableRefObject<number | undefined>
  /**
   * 子组件是否已经渲染
   */
  setChildrenRenderState: (isRender?: boolean) => void
}

export const HolderCtx = createContext<HolderCtxValue | null>(null)

export function useHolder() {
  return useContext(HolderCtx)
}
