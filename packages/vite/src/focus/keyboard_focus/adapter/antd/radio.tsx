import type { RadioProps } from 'antd'
import React, {
  cloneElement,
  FunctionComponentElement,
  useEffect,
  useRef,
} from 'react'

import { composeRef } from '@/common/util/ref'

import { useInjectCoordinate } from '../../inject_coordinate'
import { useKeyboardFocus } from '../../keyboard_focus_context/context'
import { isNumber } from '../../utils'
import { FocusAdapterProps } from '../type'

type RadioFocusAdapterProps = RadioProps & FocusAdapterProps

const RadioFocusAdapter: React.VFC<RadioFocusAdapterProps> = (props) => {
  const { x: rawX, y: rawY, children, disabled: rawDisabled, ...rest } = props

  const disabled = !!(rawDisabled || children.props?.disabled)

  const [x, y] = useInjectCoordinate(rawX, rawY)

  const { setPoint, dispatch } = useKeyboardFocus()

  const inputNode = useRef<HTMLInputElement>(null)

  const removePoint = useRef<() => void>()
  useEffect(
    () => () => {
      removePoint.current && removePoint.current()
    },
    [],
  )
  useEffect(() => {
    if (!isNumber(x) || !isNumber(y)) return
    removePoint.current = setPoint({
      x,
      y,
      vector: {
        disabled,
        trigger() {
          if (!inputNode.current) {
            console.error(
              `[KeyboardFocus.AntdRadio] 坐标 (x${x}, y${y}) 缺少 ref 无法设置焦点`,
            )
            return
          }
          inputNode.current.focus()
        },
      },
    })
  }, [disabled, setPoint, x, y])

  return cloneElement<RadioProps>(children, {
    disabled,
    ...rest,
    ...children.props,
    ref: composeRef(
      inputNode,
      (children as FunctionComponentElement<unknown>)?.ref,
    ),
    onKeyDown: (e) => {
      e.preventDefault()
      e.stopPropagation()
      const event1 = rest?.onKeyDown
      const event2 = children.props?.onKeyDown
      if (typeof event1 === 'function') event1(e)
      if (typeof event2 === 'function') event2(e)
      if (!isNumber(x) || !isNumber(y)) return
      switch (e.key) {
        case 'Enter': {
          e.currentTarget?.click && e.currentTarget.click()
          dispatch({
            currentX: x,
            currentY: y,
            keyName: e.key,
            type: 'AntdRadio',
          })
          break
        }
        default: {
          dispatch({
            currentX: x,
            currentY: y,
            keyName: e.key,
            type: 'AntdRadio',
          })
        }
      }
    },
  })
}

export default RadioFocusAdapter
