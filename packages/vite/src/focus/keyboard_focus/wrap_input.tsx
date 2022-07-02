import React, { cloneElement, ReactElement, useEffect, useRef } from 'react'

import useFocusContext from './hooks/use_focus_ctx'
import useInputFocus from './hooks/use_input_focus'

type NativeInputProps = React.InputHTMLAttributes<HTMLInputElement>

interface WrapInputProps extends NativeInputProps {
  y: number
  children: ReactElement
}

const WrapInput: React.VFC<WrapInputProps> = (props) => {
  const { y, children, ...rest } = props
  const context = useFocusContext()
  const { setPoint } = context

  const inputNode = useRef<HTMLInputElement>(null)

  const onKeyDown = useInputFocus({ ...context, y })

  // const forceRecordDep = forceRecordDepValue.current

  useEffect(() => {
    return setPoint({
      y,
      trigger() {
        if (!inputNode.current) return
        inputNode.current.focus()
        setTimeout(() => {
          inputNode.current!.select()
        })
      },
    })
  }, [setPoint, y])

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

export default WrapInput
