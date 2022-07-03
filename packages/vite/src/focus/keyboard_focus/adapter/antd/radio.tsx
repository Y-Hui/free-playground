import type { RadioProps } from 'antd'
import React, { cloneElement, useEffect, useRef } from 'react'

import { useKeyboardFocus } from '../../context/focus'
import { FocusAdapterProps } from '../type'

type RadioFocusAdapterProps = RadioProps & FocusAdapterProps

const RadioFocusAdapter: React.VFC<RadioFocusAdapterProps> = (props) => {
  const { x, y, children, ...rest } = props
  const { setPoint, notifyBottom, notifyLeft, notifyRight, notifyTop } =
    useKeyboardFocus()

  const inputNode = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return setPoint({
      x,
      y,
      vector: {
        trigger() {
          if (!inputNode.current) return
          inputNode.current.focus()
        },
      },
    })
  }, [setPoint, x, y])

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
      if (typeof x !== 'number') return
      switch (e.key) {
        case 'ArrowLeft': {
          notifyLeft(x, y)
          break
        }
        case 'ArrowRight': {
          notifyRight(x, y)
          break
        }
        case 'ArrowUp': {
          notifyTop(x, y)
          break
        }
        case 'ArrowDown': {
          notifyBottom(x, y)
          break
        }
        // no default
      }
    },
  })
}

export default RadioFocusAdapter
