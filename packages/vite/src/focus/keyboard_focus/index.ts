import Holder from './context/holder/holder'
import FocusManage from './keyboard_focus_context'
import WrapInput from './wrap_input'
import WrapSelect from './wrap_select'

export type { KeyboardFocusRef } from './keyboard_focus_context'
type KeyboardFocusComponent = typeof FocusManage & {
  Input: typeof WrapInput
  Select: typeof WrapSelect
  Holder: typeof Holder
}

const KeyboardFocus = FocusManage as KeyboardFocusComponent
KeyboardFocus.Input = WrapInput
KeyboardFocus.Select = WrapSelect
KeyboardFocus.Holder = Holder

export default KeyboardFocus
