import type { ComponentType } from 'react'

export interface RouteConfig {
  /**
   * 路由路径
   */
  path: string
  /**
   * 重定向至目标路由
   */
  redirectTo?: string
  /**
   * 重定向时是否携带 search
   */
  redirectWithState?: boolean
  /**
   * 需要渲染的组件
   */
  component?: ComponentType
  /**
   * 子路由
   */
  routes?: RouteConfig[]
  /**
   * 标签页 title
   */
  title?: string
  /**
   * 路由外部包裹组件
   * 可用于实现路由鉴权。
   *
   * @note 注意：组件内部渲染 `children` 则显示路由
   */
  wrapper?: ComponentType
}
