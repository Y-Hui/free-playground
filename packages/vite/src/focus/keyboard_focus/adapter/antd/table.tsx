import type { TableProps } from 'antd'
import type { ColumnsType } from 'antd/lib/table/interface'
import _ from 'lodash'
import React, { PropsWithChildren, useMemo, useRef } from 'react'

import { InjectCoordinate } from '../../inject_coordinate'
import KeyboardFocusContext from '../../keyboard_focus_context'
import { composeRef } from '../../utils/ref'

const AntdTableFocusAdapter: React.FC<PropsWithChildren> = (props) => {
  const { children } = props
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

  const container = useRef<HTMLDivElement>()

  return (
    <KeyboardFocusContext
      onFocus={(x, y) => {
        console.log(y, x)
      }}
    >
      {React.cloneElement<TableProps<unknown>>(children, {
        ...children.props,
        ref: composeRef(children?.ref, container),
        columns,
      })}
    </KeyboardFocusContext>
  )
}

export default AntdTableFocusAdapter
