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
  // const holder = useHolder()
  // const context = useKeyboardFocus()
  const context = useFocusContext()
  const { xAxisIndex, setPoint, removePoint, setChildrenRenderState } = context

  const inputNode = useRef<HTMLInputElement>(null)

  const onKeyDown = useInputFocus({ ...context, y })

  // const vector = useMemo<Vector>(() => {
  //   return {
  //     setXAxisValue(x) {
  //       xIndex.current = x
  //     },
  //     trigger() {
  //       if (!inputNode.current) return
  //       inputNode.current.focus()
  //       setTimeout(() => {
  //         inputNode.current!.select()
  //       })
  //     },
  //   }
  // }, [xIndex])

  useEffect(() => {
    setChildrenRenderState && setChildrenRenderState(true)
    setPoint({
      x: xAxisIndex.current,
      y,
      trigger() {
        if (!inputNode.current) return
        inputNode.current.focus()
        setTimeout(() => {
          inputNode.current!.select()
        })
      },
    })
    return () => {
      setChildrenRenderState && setChildrenRenderState(false)
      if (typeof xAxisIndex.current !== 'number') return
      removePoint(xAxisIndex.current, y)
    }
  }, [setChildrenRenderState, removePoint, setPoint, xAxisIndex, y])

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
