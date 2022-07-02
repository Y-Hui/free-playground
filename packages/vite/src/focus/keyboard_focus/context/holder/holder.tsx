import _ from 'lodash'
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react'

import { SetPointOptions, useKeyboardFocus } from '../focus/index'
import { HolderCtx, HolderCtxValue } from './ctx'

interface FocusHolderProps {
  y: number
}

/**
 * 占位符，预先占用一个坐标
 */
const FocusHolder: React.FC<PropsWithChildren<FocusHolderProps>> = (props) => {
  const { y, children } = props

  const {
    setPointHolder,
    removePoint,
    replacePoint,
    transform2Holder,
    setPoint: setPointFn,
  } = useKeyboardFocus()

  const xAxisIndex = useRef<number>()
  const childrenIsRendered = useRef(false)

  const state = useMemo(() => {
    const result: HolderCtxValue = {
      xCoordinate: xAxisIndex,
      setChildrenRenderState(val) {
        childrenIsRendered.current = !!val
      },
      // 此函数是给子元素用的，所以它不能删除坐标
      setPoint(options) {
        result.setChildrenRenderState(true)
        const x = xAxisIndex.current
        if (typeof x === 'number') {
          console.log('Holder 替换坐标', options.y, xAxisIndex.current)
          replacePoint(x, options.y, {
            trigger: options.trigger,
            setXAxisValue(newXValue) {
              xAxisIndex.current = newXValue
            },
          })
        } else {
          console.log('Holder 添加坐标', options.y, xAxisIndex.current)
          setPointFn({
            y: options.y,
            vector: {
              trigger: options.trigger,
              setXAxisValue(newXValue) {
                xAxisIndex.current = newXValue
              },
            },
          })
        }
        return () => {
          result.setChildrenRenderState(false)
          console.warn('Holder 转换坐标', options.y, xAxisIndex.current)
          if (typeof xAxisIndex.current !== 'number') return
          // 此函数是给子元素用的，所以它不能删除坐标
          transform2Holder(xAxisIndex.current, options.y)
        }
      },
    }
    return result
  }, [setPointFn, replacePoint, transform2Holder])

  useEffect(() => {
    // 若子组件已经渲染，则不再添加占位符
    // 因为 React 的渲染顺序是子组件渲染后再渲染父组件，
    // 所以，子组件已经添加了坐标，此时便不再需要添加占位符了。
    if (!childrenIsRendered.current) {
      console.log('添加占位符', y, xAxisIndex.current)
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
    }
    return () => {
      console.warn('想要删除占位符', y, xAxisIndex.current)
      if (typeof xAxisIndex.current !== 'number') return
      console.warn('删除占位符', y, xAxisIndex.current)
      removePoint(xAxisIndex.current, y)
      xAxisIndex.current = undefined
    }
  }, [removePoint, setPointHolder, y])

  return <HolderCtx.Provider value={state}>{children}</HolderCtx.Provider>
}

export default FocusHolder
