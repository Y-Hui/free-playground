## 焦点管理

```tsx
import KeyboardFocus from './index'

export default () => {
  return (
    <KeyboardFocus>
      <div>
        <p>第一行</p>
        <KeyboardFocus.Input y={0} x={0}>
          <input />
        </KeyboardFocus.Input>
        <KeyboardFocus.Input y={0} x={1}>
          <input />
        </KeyboardFocus.Input>
        <KeyboardFocus.Input y={0} x={2}>
          <input />
        </KeyboardFocus.Input>
      </div>

      <div>
        <p>第二行</p>
        <KeyboardFocus.Input y={1} x={0}>
          <input />
        </KeyboardFocus.Input>
        <KeyboardFocus.Input y={1} x={1}>
          <input />
        </KeyboardFocus.Input>
        <KeyboardFocus.Input y={2} x={2}>
          <input />
        </KeyboardFocus.Input>
      </div>
    </KeyboardFocus>
  )
}
```

### KeyboardFocus.Input

支持 antd Input、InputNumber 组件与原生 input 标签。

### KeyboardFocus.AntdCascader

适配 antd Cascader 组件。

### KeyboardFocus.AntdSelect

适配 antd Select 组件。

### KeyboardFocus.AntdTable

适配 antd Table 组件，表单修饰组件便可以不再传递 x,y 坐标值。

```tsx
import { Table, InputNumber } from 'antd'

export default () => {
  return (
    <KeyboardFocus.AntdTable>
      <Table
        columns={[
          {
            dataIndex: '0',
            title: 'Demo',
            render(val, row, index) {
              return (
                // 若外层有 KeyboardFocus.AntdTable，则可以不用传 x,y 坐标
                <KeyboardFocus.Input>
                  <InputNumber keyboard={false} />
                </KeyboardFocus.Input>
              )
            },
          },
        ]}
      />
    </KeyboardFocus.AntdTable>
  )
}
```
