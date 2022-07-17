import { Input, InputNumber, Radio, Select, Space } from 'antd'
import type { FC } from 'react'

import KeyboardFocus from '../../keyboard_focus'

const FormDemo: FC = () => {
  return (
    <KeyboardFocus>
      <Space direction="vertical">
        <KeyboardFocus.Input y={0} x={0}>
          <InputNumber keyboard={false} />
        </KeyboardFocus.Input>
        <KeyboardFocus.AntdSelect y={1} x={0}>
          <Select className="w-[120px]" disabled />
        </KeyboardFocus.AntdSelect>
        <Radio.Group>
          <Space direction="vertical">
            <KeyboardFocus.AntdRadio y={2} x={0}>
              <Radio value={1}>1</Radio>
            </KeyboardFocus.AntdRadio>
            <KeyboardFocus.AntdRadio y={3} x={0}>
              <Radio value={2} disabled>
                2
              </Radio>
            </KeyboardFocus.AntdRadio>
            <KeyboardFocus.AntdRadio y={4} x={0}>
              <Radio value={3}>3</Radio>
            </KeyboardFocus.AntdRadio>
          </Space>
        </Radio.Group>
        <KeyboardFocus.Input y={5} x={0}>
          <InputNumber className="block" keyboard={false} />
        </KeyboardFocus.Input>
        <KeyboardFocus.Distribution y={6} x={0}>
          <Radio.Group>
            <KeyboardFocus.AntdRadio x={0}>
              <Radio value={1}>1</Radio>
            </KeyboardFocus.AntdRadio>
            <KeyboardFocus.AntdRadio x={1}>
              <Radio value={2} disabled>
                2
              </Radio>
            </KeyboardFocus.AntdRadio>
            <KeyboardFocus.AntdRadio x={2}>
              <Radio value={3}>3</Radio>
            </KeyboardFocus.AntdRadio>
          </Radio.Group>
        </KeyboardFocus.Distribution>
        <KeyboardFocus.Input y={7} x={0}>
          <Input />
        </KeyboardFocus.Input>
      </Space>
    </KeyboardFocus>
  )
}

export default FormDemo
