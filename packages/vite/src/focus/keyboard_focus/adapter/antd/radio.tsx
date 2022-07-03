import type { RadioProps } from 'antd'
import React, { cloneElement, ReactElement, useEffect, useRef } from 'react'

import useFocusContext from '../../hooks/use_focus_ctx'

interface RadioFocusAdapterProps extends RadioProps {
  y: number
  focusKey: React.Key
  children: ReactElement
}

const RadioFocusAdapter: React.VFC<RadioFocusAdapterProps> = (props) => {
  const { y, children, focusKey, ...rest } = props
  const {
    setPoint,
    notifyBottom,
    notifyLeft,
    notifyRight,
    notifyTop,
    xAxisIndex,
    forceRenderDep,
    forceRenderValue,
  } = useFocusContext()

  const inputNode = useRef<HTMLInputElement>(null)
  const forceRenderDepValue = forceRenderDep.current

  useEffect(() => {
    return setPoint({
      y,
      focusKey,
      trigger() {
        if (!inputNode.current) return
        inputNode.current.focus()
      },
    })
  }, [setPoint, y, forceRenderValue, focusKey, forceRenderDepValue])

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
      if (typeof xAxisIndex.current !== 'number') return
      switch (e.key) {
        case 'ArrowLeft': {
          notifyLeft(xAxisIndex.current, y)
          break
        }
        case 'ArrowRight': {
          notifyRight(xAxisIndex.current, y)
          break
        }
        case 'ArrowUp': {
          notifyTop(xAxisIndex.current, y)
          break
        }
        case 'ArrowDown': {
          notifyBottom(xAxisIndex.current, y)
          break
        }
        // no default
      }
    },
  })
}

export default RadioFocusAdapter
