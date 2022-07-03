import { Radio, RadioGroupProps } from 'antd'
import React, { useEffect, useMemo, useRef } from 'react'

import { useKeyboardFocus } from '../../../context/focus'
import { useInjectCoordinate } from '../../../context/inject_coordinate'
import isNumber from '../../../utils/is_number'
import { FocusAdapterProps } from '../../type'
import { Focusable, FocusManage, FocusManageState } from './context'

type RadioGroupAdapterProps = RadioGroupProps &
  Omit<FocusAdapterProps, 'children'>

const RadioGroupAdapter: React.VFC<RadioGroupAdapterProps> = (props) => {
  const { children, x: rawX, y: rawY, ...rest } = props

  const [x, y] = useInjectCoordinate(rawX, rawY)

  const { setPoint, notifyBottom, notifyLeft, notifyRight, notifyTop } =
    useKeyboardFocus()

  const focusableMap = useRef<Map<any, Focusable>>()
  const firstFocus = useRef<Focusable>()
  const valueList = useRef<any[]>([])

  useEffect(() => {
    if (!isNumber(x) || !isNumber(y)) return undefined
    return setPoint({
      x,
      y,
      vector: {
        trigger() {
          if (!firstFocus.current) return
          firstFocus.current.focus()
        },
      },
    })
  }, [setPoint, x, y])

  const state = useMemo<FocusManageState>(() => {
    if (!focusableMap.current) {
      focusableMap.current = new Map<any, Focusable>()
    }
    return {
      saveFocusable(val) {
        if (!firstFocus.current) {
          firstFocus.current = val
        }
        focusableMap.current?.set(val.key, val)
        if (!valueList.current.includes(val.key)) {
          valueList.current.push(val.key)
        }
      },
      onKeyDown(key, e) {
        if (!isNumber(x) || !isNumber(y)) return
        const max = valueList.current.length - 1
        const currentIndex = valueList.current.indexOf(key)

        switch (e.key) {
          case 'ArrowLeft': {
            if (currentIndex === 0) {
              notifyLeft(x, y)
            } else {
              const target = focusableMap.current?.get(
                valueList.current[currentIndex - 1],
              )
              if (!target) {
                notifyLeft(x, y)
              } else {
                target.focus()
              }
            }
            return
          }
          case 'ArrowRight': {
            if (currentIndex === max) {
              notifyRight(x, y)
            } else {
              const target = focusableMap.current?.get(
                valueList.current[currentIndex + 1],
              )
              if (!target) {
                notifyRight(x, y)
              } else {
                target.focus()
              }
            }
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
          case 'Enter': {
            const target = focusableMap.current?.get(key)
            if (!target) return
            target.click()
            break
          }
          // no default
        }
      },
    }
  }, [notifyBottom, notifyLeft, notifyRight, notifyTop, x, y])

  return (
    <FocusManage.Provider value={state}>
      <Radio.Group {...rest}>{children}</Radio.Group>
    </FocusManage.Provider>
  )
}

export default RadioGroupAdapter
