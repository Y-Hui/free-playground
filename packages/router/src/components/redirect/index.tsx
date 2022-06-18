import { useMemo, VFC } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

export interface RedirectProps {
  /**
   * 匹配 from 路由名称时重定向
   */
  from?: string
  /**
   * 重定向目标路由
   */
  to: string
  /**
   * 携带 search, hash 信息重定向至新路由
   */
  withState?: boolean
}

/**
 * 路由重定向
 */
const Redirect: VFC<RedirectProps> = (props) => {
  const { from, to, withState = false } = props
  const { pathname, hash, search } = useLocation()

  const navigateTo = useMemo(() => {
    return withState ? { pathname: to, hash, search } : to
  }, [hash, search, to, withState])

  if (typeof from !== 'string') {
    return <Navigate to={navigateTo} replace />
  }

  if (pathname === from) {
    return <Navigate to={navigateTo} replace />
  }
  return null
}

export default Redirect
