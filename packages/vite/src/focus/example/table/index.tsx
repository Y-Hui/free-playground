import { Button, Input, InputNumber, Radio, Select, Space, Table } from 'antd'
import { ColumnsType } from 'antd/lib/table/interface'
import { FC, useState } from 'react'

import KeyboardFocus from '../../keyboard_focus'

interface MockData {
  id: string
  name?: string
  type?: string
  count?: number
  sale?: boolean
  price?: number
  unit?: string
}

function createUUID() {
  const str = URL.createObjectURL(new Blob())
  return str.substring(str.length - 36)
}

const TYPE = [
  { label: '水果', value: '水果' },
  { label: '肉类', value: '肉类' },
]
const UNIT = [
  { label: '斤', value: '斤' },
  { label: '两', value: '两' },
]

const TableDemo: FC = () => {
  const [list, setList] = useState<MockData[]>(() => [
    {
      id: createUUID(),
      name: '苹果',
      type: '水果',
      count: 88,
      sale: true,
      price: 4.5,
      unit: '斤',
    },
    {
      id: createUUID(),
      name: '香蕉',
      type: '水果',
      count: 120,
      sale: false,
      price: 3.3,
      unit: '斤',
    },
    {
      id: createUUID(),
      name: '五花肉',
      type: '肉类',
      count: 200,
      sale: true,
      price: 15,
      unit: '斤',
    },
  ])

  const updateSale = (index: number, value: boolean) => {
    setList((raw) => {
      const res = raw.slice()
      res[index].sale = !!value
      return res
    })
  }

  const columns: ColumnsType<MockData> = [
    {
      dataIndex: 'name',
      title: '名称',
      render(val) {
        return (
          <KeyboardFocus.Input>
            <Input defaultValue={val} />
          </KeyboardFocus.Input>
        )
      },
    },
    {
      dataIndex: 'type',
      title: '类型',
      width: 200,
      render(val) {
        return (
          <KeyboardFocus.AntdSelect>
            <Select className="w-full" options={TYPE} defaultValue={val} />
          </KeyboardFocus.AntdSelect>
        )
      },
    },
    {
      dataIndex: 'count',
      title: '存量',
      render(val, row) {
        return (
          <KeyboardFocus.Input>
            <InputNumber
              style={{ width: '100%' }}
              disabled={!row.sale}
              value={val}
            />
          </KeyboardFocus.Input>
        )
      },
    },
    {
      dataIndex: 'price',
      title: '销售价',
      render(val, row) {
        return (
          <Space>
            <InputNumber value={val} disabled={!row.sale} />
            <span>/</span>
            <Select
              className="w-[120px]"
              defaultValue={row.unit}
              options={UNIT}
              disabled={!row.sale}
            />
          </Space>
        )
      },
    },
    {
      dataIndex: 'sale',
      title: '销售状态',
      render(val, row, index) {
        return (
          <Radio.Group
            value={val}
            onChange={(e) => updateSale(index, e.target.value)}
          >
            <Radio value>上架</Radio>
            <Radio value={false}>下架</Radio>
          </Radio.Group>
        )
      },
    },
    {
      dataIndex: 'action',
      render(val, row, index) {
        return (
          <Space>
            <Button
              type="link"
              onClick={() => {
                setList((raw) => {
                  const res = raw.slice()
                  res.splice(index, 0, { id: createUUID(), sale: false })
                  return res
                })
              }}
            >
              添加
            </Button>
            <Button
              type="text"
              danger
              onClick={() => {
                setList((raw) => {
                  const res = raw.slice()
                  res.splice(index, 1)
                  return res
                })
              }}
            >
              删除
            </Button>
          </Space>
        )
      },
    },
  ]

  return (
    <KeyboardFocus.AntdTable>
      <Table dataSource={list} size="small" rowKey="id" columns={columns} />
    </KeyboardFocus.AntdTable>
  )
}

export default TableDemo
