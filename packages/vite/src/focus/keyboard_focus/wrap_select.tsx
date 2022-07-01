import type { SelectProps } from 'antd'
import type { RefSelectProps } from 'antd/lib/select'
import React, {
  cloneElement,
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { useKeyboardFocus, Vector } from './context'

interface WrapInputProps extends SelectProps {
  /**
   * y 坐标值
   */
  y: number
  children: ReactElement
}

const WrapInput: React.VFC<WrapInputProps> = (props) => {
  const { y, children, ...rest } = props
  const context = useKeyboardFocus()
  const {
    setPoint,
    removePoint,
    notifyBottom,
    notifyLeft,
    notifyRight,
    notifyTop,
  } = context

  const xAxisIndex = useRef<number>()
  const selectRef = useRef<RefSelectProps>()
  // 焦点是否已经离开当前组件
  const hasLeft = useRef(false)

  const [open, setOpen] = useState(false)

  const vector = useMemo<Vector>(() => {
    return {
      setXAxisValue(x) {
        xAxisIndex.current = x
      },
      trigger() {
        if (!selectRef.current) return
        selectRef.current.focus()
        setOpen(true)
      },
    }
  }, [])

  useEffect(() => {
    setPoint({ x: xAxisIndex.current, y, vector })
    return () => {
      if (typeof xAxisIndex.current !== 'number') return
      removePoint(xAxisIndex.current, y)
    }
  }, [removePoint, setPoint, vector, y])

  return cloneElement<WrapInputProps>(children, {
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
      if (typeof xAxisIndex.current !== 'number') return
      switch (e.key) {
        case 'ArrowLeft': {
          hasLeft.current = notifyLeft(xAxisIndex.current, y) === undefined
          break
        }
        case 'ArrowRight': {
          hasLeft.current = notifyRight(xAxisIndex.current, y) === undefined
          break
        }
        case 'ArrowUp': {
          if (open) return
          hasLeft.current = notifyTop(xAxisIndex.current, y) === undefined
          break
        }
        case 'ArrowDown': {
          if (open) return
          hasLeft.current = notifyBottom(xAxisIndex.current, y) === undefined
          break
        }
        // no default
      }
    },
  })
}

export default WrapInput
