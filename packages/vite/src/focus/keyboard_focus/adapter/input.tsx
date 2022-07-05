import _ from 'lodash'
import React, { cloneElement, useEffect, useRef } from 'react'

import { useInjectCoordinate } from '../inject_coordinate'
import { useKeyboardFocus } from '../keyboard_focus_context/context'
import isNumber from '../utils/is_number'
import { FocusAdapterProps } from './type'

type NativeInputProps = React.InputHTMLAttributes<HTMLInputElement>
type InputFocusAdapterProps = NativeInputProps & FocusAdapterProps

const InputFocusAdapter: React.VFC<InputFocusAdapterProps> = (props) => {
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
          setTimeout(() => {
            inputNode.current!.select()
          })
        },
      },
    })
  }, [setPoint, x, y])

  return cloneElement<NativeInputProps>(children, {
    ...rest,
    ...children.props,
    ref: inputNode,
    onKeyDown: (e) => {
      const event1 = rest?.onKeyDown
      const event2 = children.props?.onKeyDown
      if (typeof event1 === 'function') event1(e)
      if (typeof event2 === 'function') event2(e)
      if (!isNumber(x) || !isNumber(y)) return
      const { value } = e.currentTarget
      // 光标起始位置
      const startIndex = e.currentTarget.selectionStart || 0
      // 光标结束位置
      const endIndex = e.currentTarget.selectionEnd || 0
      // 没有用鼠标框选文本
      const notSelected = startIndex === endIndex
      switch (e.key) {
        case 'ArrowLeft': {
          if (!notSelected || startIndex > 0) return
          notifyLeft(x, y, { keySource: 'ArrowLeft' })
          break
        }
        case 'ArrowRight': {
          if (!notSelected || endIndex < _.size(value)) return
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
        // no default
      }
    },
  })
}

export default InputFocusAdapter
