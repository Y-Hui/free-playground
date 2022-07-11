import { ReactElement } from 'react'

export interface FocusAdapterProps {
  x?: number
  y?: number
  /** 是否禁用焦点 */
  disabled?: boolean
  children: ReactElement
}
