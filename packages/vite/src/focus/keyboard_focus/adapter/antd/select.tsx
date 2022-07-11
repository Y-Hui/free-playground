import type { SelectProps } from 'antd'
import type { RefSelectProps } from 'antd/lib/select'
import React, { cloneElement, useEffect, useRef, useState } from 'react'

import { useInjectCoordinate } from '../../inject_coordinate'
import { useKeyboardFocus } from '../../keyboard_focus_context/context'
import isNumber from '../../utils/is_number'
import { FocusAdapterProps } from '../type'

type SelectFocusAdapterProps = SelectProps & FocusAdapterProps

const SelectFocusAdapter: React.VFC<SelectFocusAdapterProps> = (props) => {
  const { children, disabled, ...rest } = props
  const [x, y] = useInjectCoordinate(props.x, props.y)
  const context = useKeyboardFocus()
  const { setPoint, notifyBottom, notifyLeft, notifyRight, notifyTop } = context

  const selectRef = useRef<RefSelectProps>()
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!isNumber(x) || !isNumber(y)) return undefined
    return setPoint({
      x,
      y,
      vector: {
        disabled,
        trigger() {
          if (!selectRef.current) return
          selectRef.current.focus()
          setOpen(true)
        },
      },
    })
  }, [setPoint, x, y, disabled])

  // 焦点是否已经离开当前组件
  const hasLeft = useRef(false)

  return cloneElement<SelectFocusAdapterProps>(children, {
    disabled,
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
          hasLeft.current =
            notifyLeft(x, y, { keySource: 'ArrowLeft' }) === undefined
          break
        }
        case 'ArrowRight': {
          hasLeft.current =
            notifyRight(x, y, { keySource: 'ArrowRight' }) === undefined
          break
        }
        case 'ArrowUp': {
          if (open) return
          hasLeft.current =
            notifyTop(x, y, { keySource: 'ArrowUp' }) === undefined
          break
        }
        case 'ArrowDown': {
          if (open) return
          hasLeft.current =
            notifyBottom(x, y, { keySource: 'ArrowDown' }) === undefined
          break
        }
        // no default
      }
    },
  })
}

export default SelectFocusAdapter
