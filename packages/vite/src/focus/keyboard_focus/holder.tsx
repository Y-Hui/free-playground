import React, { PropsWithChildren, useEffect, useMemo, useRef } from 'react'

import { HolderCtx, HolderCtxValue } from './context/holder'
import { useKeyboardFocus } from './context/index'

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
    if (childrenIsRendered.current) return undefined
    setPointHolder({
      x: xAxisIndex.current,
      y,
      setXAxisValue(x) {
        xAxisIndex.current = x
      },
    })
    return () => {
      if (typeof xAxisIndex.current !== 'number') return
      removePoint(xAxisIndex.current, y)
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
