import { TableProps } from 'antd'
import React, { cloneElement, ReactElement } from 'react'

export interface TableAdapterProps {
  children: ReactElement
}

const TableAdapter: React.VFC<TableAdapterProps> = (props) => {
  const { children } = props
  return cloneElement(children)
}

export default TableAdapter
