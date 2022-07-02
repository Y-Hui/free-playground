import AntdCascaderFocusAdapter from './adapter/antd/cascader'
import AntdRadioFocusAdapter from './adapter/antd/radio'
import AntdSelectFocusAdapter from './adapter/antd/select'
import InputFocusAdapter from './adapter/input'
import Holder from './context/holder/holder'
import FocusManage, { KeyboardFocusRef } from './keyboard_focus_context'

type KeyboardFocusComponent = typeof FocusManage & {
  Input: typeof InputFocusAdapter
  AntdCascader: typeof AntdCascaderFocusAdapter
  AntdSelect: typeof AntdSelectFocusAdapter
  AntdRadio: typeof AntdRadioFocusAdapter
  Holder: typeof Holder
}

const KeyboardFocus = FocusManage as KeyboardFocusComponent
KeyboardFocus.Input = InputFocusAdapter
KeyboardFocus.AntdSelect = AntdSelectFocusAdapter
KeyboardFocus.Holder = Holder
KeyboardFocus.AntdRadio = AntdRadioFocusAdapter
KeyboardFocus.AntdRadio = AntdRadioFocusAdapter
KeyboardFocus.AntdCascader = AntdCascaderFocusAdapter
export type { KeyboardFocusRef }
export default KeyboardFocus
