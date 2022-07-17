import { Button, Input, InputNumber, Select, Space, Table } from 'antd'
import { ColumnsType } from 'antd/lib/table/interface'
import { FC, useState } from 'react'

interface MockData {
  id: string
  name?: string
  gender?: string
  age?: number
  height?: number
}

function createUUID() {
  const str = URL.createObjectURL(new Blob())
  return str.substring(str.length - 36)
}

const GENDER = [
  { label: '男', value: '男' },
  { label: '女', value: '女' },
  { label: '其他', value: '其他' },
]

const TableDemo: FC = () => {
  const [list, setList] = useState<MockData[]>(() => [
    {
      id: createUUID(),
      name: '李雷',
      gender: '男',
      age: 25,
      height: 162,
    },
    {
      id: createUUID(),
      name: '韩梅梅',
      gender: '女',
      age: 22,
      height: 172,
    },
    {
      id: createUUID(),
      name: '路易十六',
      gender: '男',
      age: 35,
      height: 158,
    },
  ])

  const columns: ColumnsType<MockData> = [
    {
      dataIndex: 'name',
      title: '姓名',
      width: 160,
      render(val) {
        return <Input defaultValue={val} />
      },
    },
    {
      dataIndex: 'age',
      title: '年龄',
      width: 160,
      render(val) {
        return (
          <InputNumber style={{ width: '100%' }} keyboard={false} value={val} />
        )
      },
    },
    {
      dataIndex: 'gender',
      title: '性别',
      width: 200,
      render(val) {
        return <Select className="w-full" options={GENDER} defaultValue={val} />
      },
    },
    {
      dataIndex: 'height',
      title: '身高',
      width: 160,
      render(val) {
        return (
          <InputNumber style={{ width: '100%' }} keyboard={false} value={val} />
        )
      },
    },
    {
      dataIndex: 'action',
      title: '身高',
      render(val, row, index) {
        return (
          <Space>
            <Button
              type="link"
              onClick={() => {
                setList((raw) => {
                  const res = raw.slice()
                  res.splice(index, 0, { id: createUUID() })
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

  return <Table dataSource={list} size="small" rowKey="id" columns={columns} />
}

export default TableDemo
