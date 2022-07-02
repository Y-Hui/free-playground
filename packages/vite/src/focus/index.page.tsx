import {
  Button,
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
import React, { useEffect, useMemo, useRef, useState } from 'react'

import KeyboardFocus from './keyboard_focus'

const { Option } = Select

interface Data {
  key: number
  isEdit: boolean
}

const Login: React.FC = () => {
  const [data, setData] = useState<Data[]>(() =>
    _.times(4, (key) => {
      return { key, isEdit: false }
    }),
  )

  const [show, setShow] = useState(false)
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
      {
        dataIndex: '0',
        title: '文本框',
        width: 220,
        render(val, row, index) {
          return (
            <Form.Item name={[index, 'a1']} noStyle>
              <KeyboardFocus.Input y={index}>
                <Input />
              </KeyboardFocus.Input>
            </Form.Item>
          )
        },
      },
      !show
        ? null
        : {
            dataIndex: '1',
            title: '数字输入框',
            width: 100,
            render(val, row, index) {
              return (
                <Form.Item name={[index, 'a1']} noStyle>
                  <KeyboardFocus.Input y={index}>
                    <InputNumber style={{ width: 100 }} keyboard={false} />
                  </KeyboardFocus.Input>
                </Form.Item>
              )
            },
          },
      {
        dataIndex: '2',
        title: '下拉框',
        render(val, row, index) {
          return (
            <Form.Item name={[index, 'a2']} noStyle>
              <KeyboardFocus.Input y={index}>
                <InputNumber style={{ width: 100 }} keyboard={false} />
              </KeyboardFocus.Input>
              {/* <KeyboardFocus.Select y={index}>
                <Select style={{ width: '100%' }}>
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                  <Option value="Yiminghe">yiminghe</Option>
                </Select>
              </KeyboardFocus.Select> */}
            </Form.Item>
          )
        },
      },
      {
        dataIndex: '3',
        title: '条件渲染',
        width: 330,
        render(val, row, index) {
          return (
            <Form.Item name={[index, 'a3']} noStyle>
              <KeyboardFocus.Input y={index}>
                <Input style={{ width: 'auto' }} />
              </KeyboardFocus.Input>
            </Form.Item>
            // <KeyboardFocus.Holder y={index}>
            //   {!row.isEdit ? null : (
            //     <Form.Item name={[index, 'a3']} noStyle>
            //       <KeyboardFocus.Input y={index}>
            //         <Input style={{ width: 'auto' }} />
            //       </KeyboardFocus.Input>
            //     </Form.Item>
            //   )}
            //   <Button
            //     type="link"
            //     onClick={() => {
            //       setData((rawData) => {
            //         const res = _.slice(rawData)
            //         res[index] = { ...row, isEdit: !row.isEdit }
            //         return res
            //       })
            //     }}
            //   >
            //     Toggle
            //   </Button>
            // </KeyboardFocus.Holder>
          )
        },
      },
      {
        dataIndex: '4',
        title: '回车事件',
        width: 200,
        render(val, row, index) {
          return (
            <Form.Item name={[index, 'a4']} noStyle>
              <KeyboardFocus.Input y={index}>
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
        dataIndex: '5',
        title: '单选框',
        render(val, row, index) {
          return (
            <Form.Item name={[index, 'a5']} noStyle>
              <Radio.Group>
                <Radio value>上架</Radio>
                <Radio value={false}>下架</Radio>
              </Radio.Group>
            </Form.Item>
          )
        },
      },
      {
        dataIndex: 'action',
        title: '操作',
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
    <KeyboardFocus>
      <Form
        onFinish={(e) => {
          console.log(e)
        }}
      >
        <Button type="primary" htmlType="submit">
          提交
        </Button>
        <Button
          onClick={() => {
            setShow((v) => !v)
          }}
        >
          渲染列
        </Button>
        <Table
          dataSource={data}
          pagination={false}
          size="small"
          columns={columns}
        />
      </Form>
    </KeyboardFocus>
  )
}

export default Login
