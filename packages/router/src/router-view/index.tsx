import React, { useCallback } from 'react'
import { Route, Routes } from 'react-router-dom'

import { Redirect, RouteElement } from '../components'
import { RouteConfig } from '../types/route-config'

export type RouterViewProps = {
  /**
   * 路由配置
   */
  routes?: RouteConfig[]
  /**
   * 自定义渲染网页标题
   */
  websiteTitle?: (title?: string) => string
}

function map<T, R>(
  value: unknown,
  callback: (val: T, index: number) => R,
): R[] {
  if (Array.isArray(value)) {
    return value.map(callback)
  }
  return []
}

const RouterView: React.VFC<RouterViewProps> = (props) => {
  const { routes, websiteTitle: titleRender } = props

  const websiteTitle = useCallback(
    (title?: string) => {
      let result = title || ''
      if (typeof titleRender === 'function') {
        result = titleRender(title) || result
      }
      return result
    },
    [titleRender],
  )

  const renderRoute = useCallback(
    (options: RouteConfig) => {
      if (!options.component && typeof options.redirectTo === 'string') {
        return (
          <Route
            key={`redirect-${options.path}-to-${options.redirectTo}`}
            path={options.path}
            element={
              <Redirect
                key={options.redirectTo}
                from={options.path}
                to={options.redirectTo}
                withState={options.redirectWithState}
              />
            }
          />
        )
      }
      const hasNestedRoutes =
        Array.isArray(options.routes) && options.routes.length > 0
      return (
        <Route
          key={options.path}
          path={options.path}
          element={
            <RouteElement
              title={websiteTitle(options.title)}
              component={options.component}
              wrapper={options.wrapper}
              redirestFrom={options.path}
              redirectTo={options.redirectTo}
              redirectWithState={options.redirectWithState}
              hasNestedRoutes={hasNestedRoutes}
            />
          }
        >
          {hasNestedRoutes && map(options.routes, renderRoute)}
        </Route>
      )
    },
    [websiteTitle],
  )

  return <Routes>{map(routes, renderRoute)}</Routes>
}

export default RouterView
