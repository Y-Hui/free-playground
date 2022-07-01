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

import FocusHolder from './keyboard_focus/holder'
import KeyboardFocusContext from './keyboard_focus/keyboard_focus_context'
import WrapInput from './keyboard_focus/wrap_input'
import WrapSelect from './keyboard_focus/wrap_select'

const { Option } = Select

const data = _.times(4, (key) => {
  return { key, foo: key }
})

const Login: React.FC = () => {
  const [flag, setFlag] = useState(false)

  return (
    <KeyboardFocusContext>
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
                    <WrapInput y={index}>
                      <InputNumber keyboard={false} />
                    </WrapInput>
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
                    <WrapInput y={index}>
                      <InputNumber keyboard={false} />
                    </WrapInput>
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
                  <FocusHolder y={index}>
                    {row.foo === 1 && !flag ? null : (
                      <Form.Item name={[index, 'a3']} noStyle>
                        <WrapInput y={index}>
                          <Input />
                        </WrapInput>
                      </Form.Item>
                    )}
                  </FocusHolder>
                )
              },
            },
            {
              dataIndex: '4',
              title: 'Input',
              render(val, row, index) {
                return (
                  <FocusHolder y={index}>
                    {row.foo === 2 && !flag ? null : (
                      <Form.Item name={[index, 'a4']} noStyle>
                        <WrapInput y={index}>
                          <Input
                            placeholder="请按下回车"
                            onPressEnter={() => {
                              Modal.confirm({
                                content: '哈哈哈哈',
                              })
                            }}
                          />
                        </WrapInput>
                      </Form.Item>
                    )}
                  </FocusHolder>
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
    </KeyboardFocusContext>
  )
}

export default Login
