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
import _ from 'lodash'
import React, { useEffect, useState } from 'react'

import KeyboardFocus from './keyboard_focus'

const { Option } = Select

const data = _.times(4, (key) => {
  return { key, foo: key }
})

const Login: React.FC = () => {
  const [flag, setFlag] = useState(false)

  return (
    <KeyboardFocus>
      <Form
        onFinish={(e) => {
          console.log(e)
        }}
      >
        <Button
          onClick={() => {
            setFlag((v) => !v)
          }}
        >
          Change Flag
        </Button>
        <Button htmlType="submit">提交</Button>
        <Table
          dataSource={data}
          pagination={false}
          size="small"
          columns={[
            {
              dataIndex: '1',
              title: 'Input',
              render(val, row, index) {
                return (
                  <Form.Item name={[index, 'a1']} noStyle>
                    <KeyboardFocus.Input y={index}>
                      <InputNumber keyboard={false} />
                    </KeyboardFocus.Input>
                  </Form.Item>
                )
              },
            },
            {
              dataIndex: '2',
              title: 'Input',
              render(val, row, index) {
                return (
                  <Form.Item name={[index, 'a2']} noStyle>
                    <KeyboardFocus.Input y={index}>
                      <InputNumber keyboard={false} />
                    </KeyboardFocus.Input>
                    {/* <WrapSelect y={index}>
                      <Select defaultValue="lucy" style={{ width: 120 }}>
                        <Option value="jack">Jack</Option>
                        <Option value="lucy">Lucy</Option>
                        <Option value="disabled" disabled>
                          Disabled
                        </Option>
                        <Option value="Yiminghe">yiminghe</Option>
                      </Select>
                    </WrapSelect> */}
                  </Form.Item>
                )
              },
            },
            {
              dataIndex: '3',
              title: 'Input',
              render(val, row, index) {
                return (
                  <KeyboardFocus.Holder y={index}>
                    {row.foo === 1 && !flag ? null : (
                      <Form.Item name={[index, 'a3']} noStyle>
                        <KeyboardFocus.Input y={index}>
                          <Input />
                        </KeyboardFocus.Input>
                      </Form.Item>
                    )}
                  </KeyboardFocus.Holder>
                )
              },
            },
            {
              dataIndex: '4',
              title: 'Input',
              render(val, row, index) {
                return (
                  <KeyboardFocus.Holder y={index}>
                    {row.foo === 2 && !flag ? null : (
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
                    )}
                  </KeyboardFocus.Holder>
                )
              },
            },
            {
              dataIndex: '5',
              title: 'Input',
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
          ]}
        />
      </Form>
    </KeyboardFocus>
  )
}

export default Login
