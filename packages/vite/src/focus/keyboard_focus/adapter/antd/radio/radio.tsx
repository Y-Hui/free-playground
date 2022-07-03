import { Radio, RadioProps } from 'antd'
import React, { useContext, useEffect, useRef } from 'react'

import { FocusManage } from './context'

const RadioFocusAdapter: React.FC<RadioProps> = (props) => {
  const { value, onKeyDown, ...rest } = props

  const { saveFocusable, onKeyDown: onFocusToggle } =
    useContext(FocusManage) || {}

  const inputNode = useRef<HTMLInputElement>(null)

  useEffect(() => {
    saveFocusable &&
      saveFocusable({
        key: value,
        focus: () => {
          inputNode.current?.focus()
        },
        click() {
          inputNode.current?.input?.click()
        },
      })
  }, [saveFocusable, value])

  return (
    <Radio
      {...rest}
      value={value}
      ref={inputNode}
      onKeyDown={(e) => {
        e.preventDefault()
        onKeyDown && onKeyDown(e)
        onFocusToggle && onFocusToggle(value, e)
      }}
    />
  )
}

export default RadioFocusAdapter
