import {
  Button,
  Cascader,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
  Table,
} from 'antd'
import { ColumnsType } from 'antd/lib/table/interface'
import _ from 'lodash'
import React, { useMemo, useState } from 'react'

import KeyboardFocus from '../index'

const { Option } = Select

interface Data {
  key: number
  isEdit: boolean
}

interface Option2 {
  value: string | number
  label: string
  children?: Option2[]
}

const options: Option2[] = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
]

const Example: React.VFC = () => {
  const [data, setData] = useState<Data[]>(() =>
    _.times(4, (key) => {
      return { key, isEdit: false }
    }),
  )

  const [show, setShow] = useState(true)
  const columns = useMemo(() => {
    type Item = ColumnsType<Data>[number]
    const result: (ColumnsType<Data>[number] | null)[] = [
      {
        dataIndex: '00',
        title: '序号',
        width: 120,
        render(val, row) {
          return row.key
        },
      },
      !show
        ? null
        : {
            dataIndex: '1',
            title: '动态列',
            width: 120,
            render(val, row, index) {
              return (
                <Form.Item name={[index, 'number']} noStyle>
                  <KeyboardFocus.Input>
                    <InputNumber style={{ width: 100 }} keyboard={false} />
                  </KeyboardFocus.Input>
                </Form.Item>
              )
            },
          },

      {
        dataIndex: '3',
        title: '条件渲染',
        width: 200,
        render(val, row, index) {
          return (
            <>
              {!row.isEdit ? null : (
                <Form.Item name={[index, 'input']} noStyle>
                  <KeyboardFocus.Input>
                    <Input style={{ width: 100 }} />
                  </KeyboardFocus.Input>
                </Form.Item>
              )}
              <Button
                type="link"
                onClick={() => {
                  setData((rawData) => {
                    const res = _.slice(rawData)
                    res[index] = { ...row, isEdit: !row.isEdit }
                    return res
                  })
                }}
              >
                Toggle
              </Button>
            </>
          )
        },
      },
      {
        dataIndex: '0',
        title: '文本框',
        width: 180,
        render(val, row, index) {
          return (
            <KeyboardFocus.Distribution>
              <div style={{ display: 'flex' }}>
                <Form.Item name={[index, 'input1']} noStyle>
                  <KeyboardFocus.Input x={0}>
                    <Input />
                  </KeyboardFocus.Input>
                </Form.Item>
                <Form.Item name={[index, 'input2']} noStyle>
                  <KeyboardFocus.Input x={1}>
                    <Input />
                  </KeyboardFocus.Input>
                </Form.Item>
              </div>
            </KeyboardFocus.Distribution>
          )
        },
      },
      {
        dataIndex: '2',
        title: '下拉框',
        width: 140,
        render(val, row, index) {
          return (
            <Form.Item name={[index, 'select']} noStyle>
              <KeyboardFocus.AntdSelect>
                <Select style={{ width: '100%' }}>
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                  <Option value="Yiminghe">yiminghe</Option>
                </Select>
              </KeyboardFocus.AntdSelect>
            </Form.Item>
          )
        },
      },
      {
        dataIndex: '4',
        title: '回车事件',
        width: 200,
        render(val, row, index) {
          return (
            <Form.Item name={[index, 'enter']} noStyle>
              <KeyboardFocus.Input>
                <Input
                  placeholder="请按下回车"
                  onPressEnter={() => {
                    Modal.confirm({
                      content: '哈哈哈哈',
                    })
                  }}
                />
              </KeyboardFocus.Input>
            </Form.Item>
          )
        },
      },
      {
        dataIndex: '88',
        title: '级联',
        render(val, row, index) {
          return (
            <Form.Item name={[index, 'cascader']} noStyle>
              <KeyboardFocus.AntdCascader>
                <Cascader options={options} placeholder="Please select" />
              </KeyboardFocus.AntdCascader>
            </Form.Item>
          )
        },
      },
      {
        dataIndex: '5',
        title: '单选框',
        render(val, row, index) {
          return (
            <KeyboardFocus.Distribution>
              <Form.Item name={[index, 'radio']} noStyle>
                <Radio.Group name={`${index}`}>
                  <KeyboardFocus.AntdRadio x={0}>
                    <Radio value={2}>下架</Radio>
                  </KeyboardFocus.AntdRadio>
                  <KeyboardFocus.AntdRadio x={1}>
                    <Radio value={1}>上架</Radio>
                  </KeyboardFocus.AntdRadio>
                  <KeyboardFocus.AntdRadio x={2}>
                    <Radio value={3}>下架</Radio>
                  </KeyboardFocus.AntdRadio>
                </Radio.Group>
              </Form.Item>
            </KeyboardFocus.Distribution>
          )
        },
      },
      {
        dataIndex: 'action',
        title: '操作',
        width: 140,
        render(val, row, index) {
          return (
            <>
              <Button
                type="link"
                onClick={() => {
                  setData((rawData) => {
                    const res = _.slice(rawData)
                    res.splice(index, 0, { key: Date.now(), isEdit: false })
                    return res
                  })
                }}
              >
                新增
              </Button>
              <Button
                type="link"
                danger
                onClick={() => {
                  setData((rawData) => {
                    const res = _.slice(rawData)
                    res.splice(index, 1)
                    return res
                  })
                }}
              >
                删除
              </Button>
            </>
          )
        },
      },
    ]
    return _.filter(result, (item): item is Item => item !== null)
  }, [show])

  return (
    <Form
      onFinish={(e) => {
        console.log(e)
      }}
    >
      <Button type="primary" htmlType="submit">
        表单提交
      </Button>
      <Button
        onClick={() => {
          setShow((v) => !v)
        }}
      >
        渲染“动态列”显示/隐藏
      </Button>
      <KeyboardFocus.AntdTable>
        <Table
          dataSource={data}
          pagination={false}
          size="small"
          columns={columns}
        />
      </KeyboardFocus.AntdTable>
    </Form>
  )
}

export default Example