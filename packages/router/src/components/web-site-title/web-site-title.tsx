import { FC, PropsWithChildren, useEffect, useRef, useState } from 'react'

import isBrowser from '../../utils/is-browser'

export interface WebSiteTitleProps {
  /**
   * 网页标题
   */
  title?: string
}

function useTitle(title: string, restoreOnUnmount = false) {
  const titleRef = useRef(isBrowser ? document.title : '')
  const [cache] = useState(restoreOnUnmount)

  useEffect(() => {
    document.title = title
  }, [title])

  useEffect(
    () => () => {
      if (cache) {
        document.title = titleRef.current
      }
    },
    [cache],
  )
}

const WebSiteTitle: FC<PropsWithChildren<WebSiteTitleProps>> = (props) => {
  const { title, children } = props

  useTitle(`${title}`)

  // because we need safe children
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>
}

export default WebSiteTitle
