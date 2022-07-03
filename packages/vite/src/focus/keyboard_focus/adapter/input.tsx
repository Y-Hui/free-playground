import React, { cloneElement, useEffect, useRef } from 'react'

import { useKeyboardFocus } from '../context/focus'
import { useInjectCoordinate } from '../context/inject_coordinate'
import useInputFocus from '../hooks/use_input_focus'
import isNumber from '../utils/is_number'
import { FocusAdapterProps } from './type'

type NativeInputProps = React.InputHTMLAttributes<HTMLInputElement>
type InputFocusAdapterProps = NativeInputProps & FocusAdapterProps

const InputFocusAdapter: React.VFC<InputFocusAdapterProps> = (props) => {
  const { children, ...rest } = props
  const [x, y] = useInjectCoordinate(props.x, props.y)
  const context = useKeyboardFocus()
  const { setPoint } = context

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

  const onKeyDown = useInputFocus({ ...context, x: x!, y: y! })

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
      onKeyDown(e)
    },
  })
}

export default InputFocusAdapter
