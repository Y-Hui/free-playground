import type { RadioProps } from 'antd'
import React, { cloneElement, useEffect, useRef } from 'react'

import { useKeyboardFocus } from '../../context/focus'
import { useInjectCoordinate } from '../../context/inject_coordinate'
import isNumber from '../../utils/is_number'
import { FocusAdapterProps } from '../type'

type RadioFocusAdapterProps = RadioProps & FocusAdapterProps

const RadioFocusAdapter: React.VFC<RadioFocusAdapterProps> = (props) => {
  const { children, ...rest } = props
  const [x, y] = useInjectCoordinate(props.x, props.y)

  const { setPoint, notifyBottom, notifyLeft, notifyRight, notifyTop } =
    useKeyboardFocus()

  const inputNode = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isNumber(x) || !isNumber(y)) return undefined
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
      // e.preventDefault()
      const event1 = rest?.onKeyDown
      const event2 = children.props?.onKeyDown
      if (typeof event1 === 'function') event1(e)
      if (typeof event2 === 'function') event2(e)
      if (!isNumber(x) || !isNumber(y)) return
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
