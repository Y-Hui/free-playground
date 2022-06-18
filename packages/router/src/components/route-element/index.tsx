import { ComponentType, createElement, FC, Fragment, ReactNode } from 'react'
import { Outlet } from 'react-router-dom'

import { RouteConfig } from '../../types/route-config'
import Redirect from '../redirect'
import { WebSiteTitle } from '../web-site-title'

export type RouterViewProps = {
  /**
   * 自定义渲染网页标题
   */
  websiteTitle?: (title?: string) => string
}

export interface RouteElementProps
  extends Pick<RouteConfig, 'redirectTo' | 'redirectWithState'> {
  /**
   * 网页标题
   */
  title: string
  /**
   * 路由组件
   */
  component?: ComponentType
  /**
   * 外层包裹组件
   */
  wrapper?: ComponentType
  /**
   * 重定向来源
   */
  redirestFrom?: string
  /**
   * 具有嵌套路由
   *
   * 需要渲染 <Outlet />
   */
  hasNestedRoutes?: boolean
}

function renderComponent(
  component?: ComponentType,
  children?: ReactNode,
  needChildren = false,
) {
  if (component !== undefined && component !== null) {
    if (needChildren) {
      return createElement(component, null, children)
    }
    return createElement(component, null)
  }
  return null
}

/**
 * Route 组件 element 渲染内容
 */
const RouteElement: FC<RouteElementProps> = (props) => {
  const {
    title,
    component,
    redirestFrom,
    redirectTo,
    redirectWithState,
    wrapper: Wrapper = Fragment,
    hasNestedRoutes,
  } = props

  return (
    <Wrapper>
      <WebSiteTitle title={title}>
        {renderComponent(component, <Outlet />, hasNestedRoutes)}
        {redirectTo && (
          <Redirect
            from={redirestFrom}
            to={redirectTo}
            withState={redirectWithState}
          />
        )}
      </WebSiteTitle>
    </Wrapper>
  )
}

export default RouteElement
