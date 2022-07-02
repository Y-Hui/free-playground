import _ from 'lodash'
import React, { PropsWithChildren, useEffect, useMemo, useRef } from 'react'

import { useKeyboardFocus } from '../focus/index'
import { HolderCtx, HolderCtxValue } from './ctx'

interface FocusHolderProps {
  y: number
}

const FocusHolder: React.FC<PropsWithChildren<FocusHolderProps>> = (props) => {
  const { y, children } = props

  const { setPointHolder, removePoint } = useKeyboardFocus()

  const xAxisIndex = useRef<number>()
  const childrenIsRendered = useRef(false)
  useEffect(() => {
    // 若子组件已经渲染，则不再添加占位符
    // 因为 React 的渲染顺序是子组件渲染后再渲染父组件，
    // 所以，子组件已经添加了坐标，此时便不再需要添加占位符了。
    // console.log('will setPointHolder', y, xAxisIndex.current)
    if (childrenIsRendered.current) return undefined
    console.log('setPointHolder', y, xAxisIndex.current)
    setPointHolder({
      x: xAxisIndex.current,
      y,
      vector: {
        trigger: _.noop,
        setXAxisValue(x) {
          xAxisIndex.current = x
        },
      },
    })
    return () => {
      if (typeof xAxisIndex.current !== 'number') return
      console.log('removeHolder', y, xAxisIndex.current)
      removePoint(xAxisIndex.current, y)
      xAxisIndex.current = undefined
    }
  }, [removePoint, setPointHolder, y])

  const state = useMemo(() => {
    const result: HolderCtxValue = {
      xCoordinate: xAxisIndex,
      setChildrenRenderState(val) {
        childrenIsRendered.current = !!val
      },
    }
    return result
  }, [])

  return <HolderCtx.Provider value={state}>{children}</HolderCtx.Provider>
}

export default FocusHolder
