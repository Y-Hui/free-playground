import type { RadioProps } from 'antd'
import React, { cloneElement, ReactElement, useEffect, useRef } from 'react'

import useFocusContext from '../../hooks/use_focus_ctx'

interface RadioFocusAdapterProps extends RadioProps {
  y: number
  children: ReactElement
}

const RadioFocusAdapter: React.VFC<RadioFocusAdapterProps> = (props) => {
  const { y, children, ...rest } = props
  const {
    setPoint,
    notifyBottom,
    notifyLeft,
    notifyRight,
    notifyTop,
    xAxisIndex,
  } = useFocusContext()

  const inputNode = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return setPoint({
      y,
      trigger() {
        if (!inputNode.current) return
        inputNode.current.focus()
        console.log(y, xAxisIndex.current, 'focus')
      },
    })
  }, [setPoint, y])

  return cloneElement<RadioProps>(children, {
    ...rest,
    ...children.props,
    ref: inputNode,
    onKeyDown: (e) => {
      e.preventDefault()
      const event1 = rest?.onKeyDown
      const event2 = children.props?.onKeyDown
      if (typeof event1 === 'function') event1(e)
      if (typeof event2 === 'function') event2(e)
      if (typeof xAxisIndex.current !== 'number') return
      switch (e.key) {
        case 'ArrowLeft': {
          notifyLeft(xAxisIndex.current, y)
          break
        }
        case 'ArrowRight': {
          notifyRight(xAxisIndex.current, y)
          break
        }
        case 'ArrowUp': {
          notifyTop(xAxisIndex.current, y)
          break
        }
        case 'ArrowDown': {
          notifyBottom(xAxisIndex.current, y)
          break
        }
        // no default
      }
    },
  })
}

export default RadioFocusAdapter
