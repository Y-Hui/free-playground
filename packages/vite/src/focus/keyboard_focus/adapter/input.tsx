import React, { cloneElement, useEffect, useRef } from 'react'

import { useKeyboardFocus } from '../context/focus'
import useInputFocus from '../hooks/use_input_focus'
import { FocusAdapterProps } from './type'

type NativeInputProps = React.InputHTMLAttributes<HTMLInputElement>
type InputFocusAdapterProps = NativeInputProps & FocusAdapterProps

const InputFocusAdapter: React.VFC<InputFocusAdapterProps> = (props) => {
  const { x, y, children, ...rest } = props
  const context = useKeyboardFocus()
  const { setPoint } = context

  const inputNode = useRef<HTMLInputElement>(null)
  useEffect(() => {
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

  const onKeyDown = useInputFocus({ ...context, x, y })

  return cloneElement<NativeInputProps>(children, {
    ...rest,
    ...children.props,
    ref: inputNode,
    onKeyDown: (e) => {
      const event1 = rest?.onKeyDown
      const event2 = children.props?.onKeyDown
      if (typeof event1 === 'function') event1(e)
      if (typeof event2 === 'function') event2(e)
      onKeyDown(e)
    },
  })
}

export default InputFocusAdapter
