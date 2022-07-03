import AntdCascaderFocusAdapter from './adapter/antd/cascader'
import AntdRadioFocusAdapter from './adapter/antd/radio'
import AntdSelectFocusAdapter from './adapter/antd/select'
import AntdTableFocusAdapter from './adapter/antd/table'
import InputFocusAdapter from './adapter/input'
import FocusManage from './keyboard_focus_context'

type KeyboardFocusComponent = typeof FocusManage & {
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
export default KeyboardFocus
