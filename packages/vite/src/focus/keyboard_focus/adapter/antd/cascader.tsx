import type { SelectProps } from 'antd'
import type { RefSelectProps } from 'antd/lib/select'
import React, { cloneElement, useEffect, useRef, useState } from 'react'

import { useKeyboardFocus } from '../../context/focus'
import { useInjectCoordinate } from '../../context/inject_coordinate'
import isNumber from '../../utils/is_number'
import { FocusAdapterProps } from '../type'

type CascaderFocusAdapterProps = SelectProps & FocusAdapterProps

const CascaderFocusAdapter: React.VFC<CascaderFocusAdapterProps> = (props) => {
  const { children, ...rest } = props
  const [x, y] = useInjectCoordinate(props.x, props.y)

  const context = useKeyboardFocus()
  const { setPoint, notifyBottom, notifyLeft, notifyRight, notifyTop } = context

  // 焦点是否已经离开当前组件
  const hasLeft = useRef(false)
  const [open, setOpen] = useState(false)

  const selectRef = useRef<RefSelectProps>()

  useEffect(() => {
    if (!isNumber(x) || !isNumber(y)) return undefined
    return setPoint({
      x,
      y,
      vector: {
        trigger() {
          if (!selectRef.current) return
          selectRef.current.focus()
        },
      },
    })
  }, [setPoint, y, x])

  return cloneElement<CascaderFocusAdapterProps>(children, {
    ...rest,
    ...children.props,
    ref: selectRef,
    open,
    onDropdownVisibleChange: (e) => {
      if (hasLeft.current) {
        hasLeft.current = false
        return
      }
      setOpen(e)
    },
    onBlur: () => {
      setOpen(false)
    },
    onInputKeyDown: (e) => {
      const event1 = rest?.onInputKeyDown
      const event2 = children.props?.onInputKeyDown
      if (typeof event1 === 'function') {
        event1(e)
      }
      if (typeof event2 === 'function') {
        event2(e)
      }
      if (!isNumber(x) || !isNumber(y)) return
      switch (e.key) {
        case 'ArrowLeft': {
          if (open) return
          hasLeft.current = notifyLeft(x, y) === undefined
          break
        }
        case 'ArrowRight': {
          if (open) return
          hasLeft.current = notifyRight(x, y) === undefined
          break
        }
        case 'ArrowUp': {
          if (open) return
          hasLeft.current = notifyTop(x, y) === undefined
          break
        }
        case 'ArrowDown': {
          if (open) return
          hasLeft.current = notifyBottom(x, y) === undefined
          break
        }
        // no default
      }
    },
  })
}

export default CascaderFocusAdapter
