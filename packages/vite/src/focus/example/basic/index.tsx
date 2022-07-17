import './style.css'

import type { FC } from 'react'
// import KeyboardFocus from '../../keyboard_focus'

const BasicDemo: FC = () => {
  return (
    <>
      <div className="mb-6 space-x-6">
        <input className="input" type="text" defaultValue="some content..." />
        <input className="input" type="text" defaultValue="some content..." />
        <input className="input" type="text" defaultValue="some content..." />
      </div>
      <div className="mb-6 space-x-6">
        <input className="input" type="text" defaultValue="some content..." />
        <input className="input" type="text" defaultValue="some content..." />
      </div>
      <div className="mb-6 space-x-6">
        <input className="input" type="text" defaultValue="some content..." />
        <input className="input" type="text" defaultValue="some content..." />
        <input className="input" type="text" defaultValue="some content..." />
      </div>
    </>
  )
}

export default BasicDemo
