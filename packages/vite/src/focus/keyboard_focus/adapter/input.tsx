import _ from 'lodash'
import React, {
  cloneElement,
  FunctionComponentElement,
  useEffect,
  useRef,
} from 'react'

import { composeRef } from '@/common/util/ref'

import { useInjectCoordinate } from '../inject_coordinate'
import { useKeyboardFocus } from '../keyboard_focus_context/context'
import { isNumber } from '../utils'
import { FocusAdapterProps } from './type'

type NativeInputProps = React.InputHTMLAttributes<HTMLInputElement>
type InputFocusAdapterProps = NativeInputProps &
  FocusAdapterProps & {
    /**
     * 是否阻止回车键默认事件。
     * 若不阻止默认事件，在文本框中回车时将会触发表单提交
     *
     * @default true
     */
    pressEnterPreventDefault?: boolean
  }

const InputFocusAdapter: React.VFC<InputFocusAdapterProps> = (props) => {
  const {
    x: rawX,
    y: rawY,
    children,
    pressEnterPreventDefault = true,
    disabled: rawDisabled,
    ...rest
  } = props

  const disabled = !!(rawDisabled || children.props?.disabled)

  const [x, y] = useInjectCoordinate(rawX, rawY)
  const { setPoint, dispatch } = useKeyboardFocus()

  // 之所以把移除坐标的函数写在 ref 中，并通过 useEffect 来调用是有原因的。
  // 因为列表中可能有插入新行的情景。
  // 我们以为的组件渲染顺序为：
  // 1. 坐标 1 渲染，添加坐标 1
  // 2. 插入一行
  // 3. 坐标 1 让位，变成坐标 2，删除坐标 1 数据。
  // 4. 坐标 1 渲染（新插入的行），添加坐标 1（新数据）
  // 5. 坐标 2 渲染（原本的坐标 1 那个组件），添加坐标 2。（此时组件是没有卸载的，处于更新阶段）
  //
  //
  // 但是，在 React 16 中，其实这样的执行顺序：
  // 1. 坐标 1 渲染，添加坐标 1
  // 2. 插入一行
  // 3. 坐标 1 渲染（新插入的行），添加坐标 1（新数据）
  // 4. 原坐标 1 让位，变成坐标 2，清理副作用（删除坐标 1 数据），添加坐标 2。（此时组件是没有卸载的，处于更新阶段）
  //
  // useEffect 这样的调用顺序似乎有点不太合理。而在 React 17 及以上则不再是这样的调用顺序了。
  //
  // 现在，使用一个 deps 为空的 useEffect 则表示：仅在组件被卸载时才调用 remove 函数，
  // 更新阶段不会再清理副作用。
  const removePoint = useRef<() => void>()
  useEffect(
    () => () => {
      removePoint.current && removePoint.current()
    },
    [],
  )

  const inputNode = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (!isNumber(x) || !isNumber(y)) return
    // setPoint 会返回一个函数，用于在组件卸载时移除坐标
    removePoint.current = setPoint({
      x,
      y,
      vector: {
        disabled,
        trigger() {
          if (!inputNode.current) {
            console.error(
              `[KeyboardFocus.Input] 坐标 (x${x}, y${y}) 缺少 ref 无法设置焦点`,
            )
            return
          }
          inputNode.current.focus()
          setTimeout(() => {
            inputNode.current!.select()
          })
        },
      },
    })
  }, [disabled, setPoint, x, y])

  return cloneElement<NativeInputProps>(children, {
    disabled,
    ...rest,
    ...children.props,
    ref: composeRef(
      inputNode,
      (children as FunctionComponentElement<unknown>)?.ref,
    ),
    onKeyDown: (e) => {
      const onKeyDown = rest?.onKeyDown
      if (typeof onKeyDown === 'function') onKeyDown(e)
      if (!isNumber(x) || !isNumber(y)) return
      const { value } = e.currentTarget
      // 光标起始位置
      const startIndex = e.currentTarget.selectionStart || 0
      // 光标结束位置
      const endIndex = e.currentTarget.selectionEnd || 0
      // 没有用鼠标框选文本
      const notSelected = startIndex === endIndex

      switch (e.key) {
        case 'Enter': {
          if (!pressEnterPreventDefault) return
          e.preventDefault()
          return
        }
        case 'ArrowLeft': {
          if (!notSelected || startIndex > 0) return
          e.preventDefault()
          dispatch({ currentX: x, currentY: y, keyName: e.key, type: 'Input' })
          break
        }
        case 'ArrowRight': {
          if (!notSelected || endIndex < _.size(value)) return
          e.preventDefault()
          dispatch({ currentX: x, currentY: y, keyName: e.key, type: 'Input' })
          break
        }
        default: {
          dispatch({ currentX: x, currentY: y, keyName: e.key, type: 'Input' })
        }
      }
    },
  })
}

export default InputFocusAdapter
