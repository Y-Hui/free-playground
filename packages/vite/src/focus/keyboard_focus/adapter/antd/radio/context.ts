import React, { createContext } from 'react'

export interface Focusable {
  key: any
  focus: () => void
  click: () => void
}

export interface FocusManageState {
  saveFocusable: (value: Focusable) => void
  onKeyDown: (key: any, e: React.KeyboardEvent<HTMLElement>) => void
}

const FocusManage = createContext<FocusManageState | null>(null)

export { FocusManage }
