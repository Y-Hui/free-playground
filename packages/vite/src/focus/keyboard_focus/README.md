## 使用键盘方向键控制焦点

在一个可编辑的 Table 或 List 页面时，可以使用此组件让页面上的表单组件支持方向键切换焦点。

### 前置概念

> 请仔细阅读这些必要的概念，这样有助于你理解它将运行，以便你实现预期的效果 :)

#### x 坐标与 y 坐标

`<KeyboardFocus />` 组件使用二维笛卡尔坐标记录所有被标记的表单输入组件（下文称“焦点组件”）。

- 第一行第一个单元格记为：(y0, x0)

- 第一行第二个单元格记为：(y0, x1)
- 第二行第一个单元格记为：(y1, x0)
- 第二行第二个单元格记为：(y1, x1)

以此类推。在记录所有的坐标之后，在一个焦点组件中，按下键盘方向键时，便能够很方便的计算应当激活对应的焦点组件。

#### 标记表单输入组件

使用以下组件包裹对应表单输入组件便是标记一个坐标，但是需要你手动传入对应的 x, y 坐标。

> 基础用法确实是需要自行设置 x,y 坐标，下文会介绍不需要 x,y 坐标的方案。

- `KeyboardFocus.Input`
  支持 antd Input、InputNumber 组件与原生 input 标签。

  ```tsx
  import { Input, InputNumber } from 'antd'
  export default () => {
    return (
      <KeyboardFocus>
        <KeyboardFocus.Input y={0} x={0}>
          {/* 需要直接包裹 input 标签 */}
          <input />
        </KeyboardFocus.Input>
        
        <KeyboardFocus.Input y={0} x={1}>
          {/* 需要直接包裹 Input 组件 */}
          <Input />
        </KeyboardFocus.Input>
        
        <KeyboardFocus.Input y={0} x={2}>
          {/* 注意：InputNumber 组件需要设置 keyboard=false, 因为它包含默认的键盘事件。 */}
          <InputNumber keyboard={false} />
        </KeyboardFocus.Input>
      <KeyboardFocus/>
    )
  }
  ```
  
- `KeyboardFocus.AntdSelect`
  适配 antd Select 组件。
  使用方法同上。
  
- `KeyboardFocus.AntdCascader`
  适配 antd Cascader 组件。
  使用方法同上。

### 基础 Demo

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

### KeyboardFocus.AntdTable

适配 antd Table 组件，焦点组件便可以不再传递 x, y 坐标。

```tsx
import { Table, InputNumber } from 'antd'

export default () => {
  return (
    <KeyboardFocus.AntdTable>
      {/* 需要直接包裹 Table 组件。 */}
      <Table
        columns={[
          {
            dataIndex: '0',
            title: 'Demo',
            render(val, row, index) {
              return (
                // 现在便可以不再传递 x,y 坐标
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

这样确实在开发体验上有了非常大的提升，但是，这样却需要付出代价。

 `<KeyboardFocus.AntdTable />` 它会劫持 Table 的 columns 属性，在 render 函数中向下注入坐标信息，x 坐标来源于 columns 的索引，y 坐标来源于 render 函数的第三个参数。

这样的坐标信息意味着会将单元格视为一个整体，并只为其分配**一个**焦点。若你的单元格中存在多个 `<input />` 时，无论你在 Table 的 render 函数中如何标记坐标，都无济于事，因为焦点有且仅有一个。

> 在基础 Demo 中，手动标记一个 `<input />` 或者其他组件就意味着它是一个坐标点，也相当于分配了一个焦点。

### 焦点分发

在上一节中，为了开发体验，我们付出了一定的代价——失去了自由标记坐标的能力。在这一节中，将会帮助你**弥补**这个缺陷。

> 注意：是弥补，而不是修复这个缺陷。仅在目前看来这个缺陷确实是无法修复。



使用 `<KeyboardFocus.Distribution />` 组件可实现一个焦点分发给多个输入组件。

```tsx
import { Table, InputNumber } from 'antd'

export default () => {
  return (
    <KeyboardFocus.AntdTable>
      {/* 需要直接包裹 Table 组件。 */}
      <Table
        columns={[
          {
            dataIndex: 'title1',
            title: '标题 1',
            render(val, row, index) {
              return (
                <KeyboardFocus.Input>
                  <InputNumber keyboard={false} />
                </KeyboardFocus.Input>
              )
            },
          },
          {
            dataIndex: 'title2',
            title: '标题 2',
            render(val, row, index) {
              return (
                // 在外层使用此组件即可完成焦点分发
                <KeyboardFocus.Distribution>
                  <div style={{ display: 'flex' }}>
                    {/* 需要手动标记 x 坐标，从 0 开始标记 */}
                    <KeyboardFocus.Input x={0}>
                      <InputNumber keyboard={false} />
                    </KeyboardFocus.Input>

                    {/* 不需要标记 y 坐标，那将没有任何作用的 */}
                    <KeyboardFocus.Input x={1}>
                      <Input />
                    </KeyboardFocus.Input>
                  </div>
                </KeyboardFocus.Distribution>
              )
            },
          },
        ]}
      />
    </KeyboardFocus.AntdTable>
  )
}
```

#### 为什么焦点分发时需要标记 x 坐标？为什么 y 坐标没有作用？

在这个场景中，实际上是缺少了在 x 轴上标记坐标的能力，而不应该考虑 y 轴。那么焦点数量应当是较少的，而不应该过于复杂，所以并没有处理坐标自动注入。

此组件实际上是在一个单元格中创建了一个仅有 x 轴的坐标系（y 坐标始终为 0），因为是一个独立的坐标系，所以，在填写 x 坐标的时候需要重新开始。

### 自定义组件如何适配焦点？

```tsx
interface NewComponentProps {
  x?: number
  y?: number
}

const NewComponent: React.VFC<NewComponentProps> (props) => {
  // 接受自动注入的坐标
  const [x, y] = useInjectCoordinate(props.x, props.y)
  // 用于切换焦点的一些函数
  const { setPoint, notifyTop, notifyBottom, notifyLeft, notifyRight } = useKeyboardFocus()
  
  const inputNode = useRef<HTMLInputElement>(null)
  
  useEffect(() => {
    setPoint({
      x,
      y,
      vector: {
        trigger() {
          console.log('通知此组件要设置焦点了')
          // 设置焦点
          inputNode.current?.focus()
        },
      },
    })
  }, [x, y, setPoint])
  
  return (
    <input
      ref={inputNode}
      onKeyDown={(e) => {
      	// 判断不同的按键调用不同的切换焦点函数
        if(e.key === 'ArrowTop') {
          // 焦点向上移动
          notifyTop(x, y)
        }
    	}}
    />
  )
}
```



### 杂项

需要自行传入 x,y 坐标，这样的开发体验实在是太差了，但是由于自动生成坐标会存在许多边界情况，所以传入明确坐标确实是不可避免的。只有在传入明确的坐标情况下，组件多次挂载、卸载时才能保持幂等。

所述边界情况大致为：

- 在焦点组件卸载时，对应坐标应当被删除，删除后，其他的坐标无论是否向前补位
- x 轴上，某个焦点组件默认不渲染，达到某些条件后才渲染，此时无法生成新的坐标，因为坐标与坐标之间是没有任何关联关系的，所以无法得知这个新的坐标应该位于 x 轴的哪一个位置。但是经过一些复杂的过程依然可以生成坐标，不过整个过程并不是幂等的，可能随着这个组件的卸载导致脏坐标一直驻留，导致后续坐标位置严重偏移。
- 若 Table 组件可随意控制某一列是否需要渲染，此时整列焦点组件的坐标的生成也会遇到上一个问题。
- 若 Table 组件可随意排列表头的顺序，那么所有坐标都需要被丢弃。
