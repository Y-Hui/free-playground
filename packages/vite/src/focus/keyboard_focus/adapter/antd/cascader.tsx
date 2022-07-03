import type { SelectProps } from 'antd'
import type { RefSelectProps } from 'antd/lib/select'
import React, {
  cloneElement,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react'

import useFocusContext from '../../hooks/use_focus_ctx'

interface CascaderFocusAdapterProps extends SelectProps {
  /**
   * y 坐标值
   */
  y: number
  focusKey: React.Key
  children: ReactElement
}

const CascaderFocusAdapter: React.VFC<CascaderFocusAdapterProps> = (props) => {
  const { y, children, focusKey, ...rest } = props
  const context = useFocusContext()
  const {
    setPoint,
    notifyBottom,
    notifyLeft,
    notifyRight,
    notifyTop,
    xAxisIndex,
    forceRenderDep,
    forceRenderValue,
  } = context

  const selectRef = useRef<RefSelectProps>()
  // 焦点是否已经离开当前组件
  const hasLeft = useRef(false)

  const [open, setOpen] = useState(false)
  const forceRenderDepValue = forceRenderDep.current

  useEffect(() => {
    return setPoint({
      y,
      focusKey,
      trigger() {
        if (!selectRef.current) return
        selectRef.current.focus()
      },
    })
  }, [setPoint, y, focusKey, forceRenderValue, forceRenderDepValue])

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
      if (typeof xAxisIndex.current !== 'number') return
      switch (e.key) {
        case 'ArrowLeft': {
          if (open) return
          hasLeft.current = notifyLeft(xAxisIndex.current, y) === undefined
          break
        }
        case 'ArrowRight': {
          if (open) return
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

export default CascaderFocusAdapter
