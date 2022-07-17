import { composeRef } from '@/common/util/ref'
import type { TableProps } from 'antd'
import type { ColumnsType } from 'antd/lib/table/interface'
import _ from 'lodash'
import React, { FunctionComponentElement, useMemo, useRef } from 'react'

import { InjectCoordinate } from '../../inject_coordinate'
import KeyboardFocusContext, {
  KeyboardFocusContextProps,
} from '../../keyboard_focus_context'

export interface AntdTableFocusAdapterProps extends KeyboardFocusContextProps {
  /**
   * 左侧固定列的总宽度（用于在执行滚动时计算）
   */
  leftFixedWidth?: number | (() => number)
  /**
   * 右侧固定列的总宽度（用于在执行滚动时计算）
   */
  rightFixedWidth?: number | (() => number)
}

function getValue<T>(value: T | (() => T)) {
  if (typeof value === 'function') {
    return (value as () => T)()
  }
  return value
}

const AntdTableFocusAdapter: React.FC<AntdTableFocusAdapterProps> = (props) => {
  const {
    leftFixedWidth = 0,
    rightFixedWidth = 0,
    onFocused,
    children,
    ...rest
  } = props

  if (!React.Children.only(children) || !React.isValidElement(children)) {
    throw Error('AntdTableFocusAdapter can only one child.')
  }

  const rawColumns = children.props?.columns as ColumnsType<unknown>
  const columns = useMemo(() => {
    const result: ColumnsType<unknown> = _.map(rawColumns, (item, x) => {
      const { render } = item
      if (!render) {
        return item
      }
      return {
        ...item,
        render(val, row, y) {
          return (
            <InjectCoordinate.Provider value={`[${x}, ${y}]`}>
              <>{render(val, row, y)}</>
            </InjectCoordinate.Provider>
          )
        },
      }
    })
    return result
  }, [rawColumns])

  const tableRef = useRef<HTMLDivElement>()

  const handleFocused = (x: number, y: number) => {
    onFocused && onFocused(x, y)
    if (!tableRef.current) return
    const FIXED_LEFT = getValue(leftFixedWidth)
    const FIXED_RIGHT = getValue(rightFixedWidth)

    const table =
      tableRef.current.querySelector<HTMLDivElement>('.ant-table-body')
    if (!table) return
    const tableScrollLeft = table.scrollLeft
    const tableWidth = table.offsetWidth

    const row = table.querySelectorAll('.ant-table-row').item(y)
    const td = _.filter(row?.querySelectorAll('td'), (item) => {
      return (
        !item.classList.contains('ant-table-selection-column') &&
        !item.classList.contains('ant-table-row-expand-icon-cell')
      )
    })[x]

    if (!td) return
    const { offsetLeft, offsetWidth } = td

    // 焦点组件被左侧固定列遮挡时
    const targetLeft = offsetLeft - FIXED_LEFT
    if (targetLeft < tableScrollLeft) {
      table.scrollLeft = Math.max(targetLeft, 0)
      return
    }

    // 焦点组件被右侧固定列遮挡时
    const right = offsetLeft + offsetWidth - (tableWidth - FIXED_RIGHT)
    if (right > tableScrollLeft) {
      table.scrollLeft = Math.max(right, 0)
    }
  }

  return (
    <KeyboardFocusContext {...rest} onFocused={handleFocused}>
      {React.cloneElement<TableProps<unknown>>(children, {
        ...children.props,
        columns,
        ref: composeRef(
          tableRef,
          (children as FunctionComponentElement<unknown>)?.ref,
        ),
      })}
    </KeyboardFocusContext>
  )
}

AntdTableFocusAdapter.displayName = 'AntdTableFocusAdapter'

export default AntdTableFocusAdapter
