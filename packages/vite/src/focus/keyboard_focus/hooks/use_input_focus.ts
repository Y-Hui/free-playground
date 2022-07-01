import _ from 'lodash'
import React, { MutableRefObject, useCallback } from 'react'

import type { KeyboardFocusCtxValue } from '../context'

interface InputFocusOptions
  extends Pick<
    KeyboardFocusCtxValue,
    'notifyRight' | 'notifyLeft' | 'notifyBottom' | 'notifyTop'
  > {
  y: number
  xAxisIndex: MutableRefObject<number | undefined>
}

export default function useInputFocusState(options: InputFocusOptions) {
  const { notifyRight, notifyLeft, notifyBottom, notifyTop, xAxisIndex, y } =
    options

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (typeof xAxisIndex.current !== 'number') return
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
          notifyLeft(xAxisIndex.current, y)
          break
        }
        case 'ArrowRight': {
          if (!notSelected || endIndex < _.size(value)) return
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
    [notifyBottom, notifyLeft, notifyRight, notifyTop, xAxisIndex, y],
  )

  return onKeyDown
}
