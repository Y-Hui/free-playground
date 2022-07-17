import 'antd/dist/antd.css'

import type { FC } from 'react'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'

import Basic from '@/focus/example/basic'
import FormDemo from '@/focus/example/form'
import Focus from '@/focus/example/index'
import BasicTable from '@/focus/example/table/basic'
import ComplexTable from '@/focus/example/table/index'

const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Focus>
              <Outlet />
            </Focus>
          }
        >
          <Route path="basic" element={<Basic />} />
          <Route path="basic-table" element={<BasicTable />} />
          <Route path="complex-table" element={<ComplexTable />} />
          <Route path="basic-form" element={<FormDemo />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
