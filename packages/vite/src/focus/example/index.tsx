import type { FC, PropsWithChildren } from 'react'
import { Link } from 'react-router-dom'

const FocusDemo: FC<PropsWithChildren> = (props) => {
  const { children } = props
  return (
    <div className="p-30">
      <nav className="mb-16 space-x-6">
        <Link className="underline" to="/basic">
          Basic
        </Link>
        <Link className="underline" to="/basic-table">
          Basic Table
        </Link>
        <Link className="underline" to="/complex-table">
          Complex Table
        </Link>
        <Link className="underline" to="/basic-form">
          Form
        </Link>
      </nav>
      {children}
    </div>
  )
}

export default FocusDemo
