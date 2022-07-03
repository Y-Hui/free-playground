import React, { cloneElement, ReactElement, useEffect, useRef } from 'react'

import useFocusContext from '../hooks/use_focus_ctx'
import useInputFocus from '../hooks/use_input_focus'
// import { warn } from '../utils/warn'

type NativeInputProps = React.InputHTMLAttributes<HTMLInputElement>

interface InputFocusAdapterProps extends NativeInputProps {
  y: number
  focusKey: React.Key
  children: ReactElement
}

const InputFocusAdapter: React.VFC<InputFocusAdapterProps> = (props) => {
  const { y, children, focusKey, ...rest } = props
  const context = useFocusContext()
  const { setPoint, forceRenderValue, forceRenderDep } = context

  const inputNode = useRef<HTMLInputElement>(null)

  const onKeyDown = useInputFocus({ ...context, y })

  const forceRenderDepValue = forceRenderDep.current

  // console.log(
  //   'InputFocusAdapter',
  //   foo,
  //   y,
  //   context.xAxisIndex.current,
  //   forceRender,
  // )
  useEffect(() => {
    // console.log(
    //   'InputFocusAdapter useEffect',
    //   foo,
    //   y,
    //   context.xAxisIndex.current,
    // )
    return setPoint({
      focusKey,
      y,
      trigger() {
        if (!inputNode.current) return
        inputNode.current.focus()
        setTimeout(() => {
          inputNode.current!.select()
        })
      },
    })
  }, [setPoint, y, forceRenderValue, focusKey, forceRenderDepValue])

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
