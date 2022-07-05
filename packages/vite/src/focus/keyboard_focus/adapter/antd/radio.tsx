import type { RadioProps } from 'antd'
import React, { cloneElement, useEffect, useRef } from 'react'

import { useInjectCoordinate } from '../../inject_coordinate'
import { useKeyboardFocus } from '../../keyboard_focus_context/context'
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
      e.preventDefault()
      e.stopPropagation()
      const event1 = rest?.onKeyDown
      const event2 = children.props?.onKeyDown
      if (typeof event1 === 'function') event1(e)
      if (typeof event2 === 'function') event2(e)
      if (!isNumber(x) || !isNumber(y)) return
      switch (e.key) {
        case 'ArrowLeft': {
          notifyLeft(x, y, { keySource: 'ArrowLeft' })
          break
        }
        case 'ArrowRight': {
          notifyRight(x, y, { keySource: 'ArrowRight' })
          break
        }
        case 'ArrowUp': {
          notifyTop(x, y, { keySource: 'ArrowUp' })
          break
        }
        case 'ArrowDown': {
          notifyBottom(x, y, { keySource: 'ArrowDown' })
          break
        }
        case 'Enter': {
          e.currentTarget?.click()
          break
        }
        // no default
      }
    },
  })
}

export default RadioFocusAdapter
