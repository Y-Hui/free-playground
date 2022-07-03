import _ from 'lodash'
import React, { useCallback } from 'react'

import type { KeyboardFocusCtxValue } from '../context/focus'

interface InputFocusOptions
  extends Pick<
    KeyboardFocusCtxValue,
    'notifyRight' | 'notifyLeft' | 'notifyBottom' | 'notifyTop'
  > {
  x: number
  y: number
}

export default function useInputFocusState(options: InputFocusOptions) {
  const { notifyRight, notifyLeft, notifyBottom, notifyTop, x, y } = options

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (typeof x !== 'number') return
      const { value } = e.currentTarget
      // 光标起始位置
      const startIndex = e.currentTarget.selectionStart || 0
      // 光标结束位置
      const endIndex = e.currentTarget.selectionEnd || 0
      // 没有用鼠标框选文本
      const notSelected = startIndex === endIndex
      switch (e.key) {
        case 'ArrowLeft': {
          if (!notSelected || startIndex > 0) return
          notifyLeft(x, y)
          break
        }
        case 'ArrowRight': {
          if (!notSelected || endIndex < _.size(value)) return
          notifyRight(x, y)
          break
        }
        case 'ArrowUp': {
          notifyTop(x, y)
          break
        }
        case 'ArrowDown': {
          notifyBottom(x, y)
          break
        }
        // no default
      }
    },
    [notifyBottom, notifyLeft, notifyRight, notifyTop, x, y],
  )

  return onKeyDown
}
