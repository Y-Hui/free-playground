import React, { cloneElement, ReactElement, useEffect, useRef } from 'react'

import useFocusContext from '../hooks/use_focus_ctx'
import useInputFocus from '../hooks/use_input_focus'

type NativeInputProps = React.InputHTMLAttributes<HTMLInputElement>

interface InputFocusAdapterProps extends NativeInputProps {
  y: number
  foo: string
  children: ReactElement
}

const InputFocusAdapter: React.VFC<InputFocusAdapterProps> = (props) => {
  const { y, children, foo, ...rest } = props
  const context = useFocusContext()
  const { setPoint, forceRenderDep } = context

  const inputNode = useRef<HTMLInputElement>(null)

  const onKeyDown = useInputFocus({ ...context, y })

  const forceRender = forceRenderDep.current
  console.log(
    'InputFocusAdapter',
    foo,
    y,
    context.xAxisIndex.current,
    forceRender,
  )
  useEffect(() => {
    console.log(
      'InputFocusAdapter useEffect',
      foo,
      y,
      context.xAxisIndex.current,
    )
    return setPoint({
      foo,
      y,
      trigger() {
        if (!inputNode.current) return
        inputNode.current.focus()
        setTimeout(() => {
          inputNode.current!.select()
        })
      },
    })
  }, [setPoint, y, foo, forceRender, context.xAxisIndex])

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
