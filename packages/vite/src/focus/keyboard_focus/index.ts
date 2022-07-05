import AntdCascaderFocusAdapter from './adapter/antd/cascader'
import AntdRadioFocusAdapter from './adapter/antd/radio'
import AntdSelectFocusAdapter from './adapter/antd/select'
import AntdTableFocusAdapter from './adapter/antd/table'
import InputFocusAdapter from './adapter/input'
import DistributionFocus from './distribution_focus'
import FocusManage from './keyboard_focus_context'

type KeyboardFocusComponent = typeof FocusManage & {
  /** 焦点分发 */
  Distribution: typeof DistributionFocus
  Input: typeof InputFocusAdapter
  AntdCascader: typeof AntdCascaderFocusAdapter
  AntdSelect: typeof AntdSelectFocusAdapter
  AntdRadio: typeof AntdRadioFocusAdapter
  AntdTable: typeof AntdTableFocusAdapter
}

const KeyboardFocus = FocusManage as KeyboardFocusComponent
KeyboardFocus.Input = InputFocusAdapter
KeyboardFocus.AntdSelect = AntdSelectFocusAdapter
KeyboardFocus.AntdRadio = AntdRadioFocusAdapter
KeyboardFocus.AntdCascader = AntdCascaderFocusAdapter
KeyboardFocus.AntdTable = AntdTableFocusAdapter
KeyboardFocus.Distribution = DistributionFocus

export type { LimitError, VectorError } from './constant/error'
export { VECTOR_ERROR } from './constant/error'
export { InjectCoordinate, useInjectCoordinate } from './inject_coordinate'
export type {
  KeyboardFocusCtxValue,
  SubCoordinates,
  Vector,
} from './keyboard_focus_context/context'
export { useKeyboardFocus } from './keyboard_focus_context/context'
export default KeyboardFocus
