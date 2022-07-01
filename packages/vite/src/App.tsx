import 'antd/dist/antd.css'

// import { RouterView } from '@kit/router'
import type { FC } from 'react'

// import { HashRouter } from 'react-router-dom'
import Content from './focus/index.page'
// import routes from './routes'

const App: FC = () => {
  return (
    <Content />
    // <HashRouter>
    //   <RouterView routes={routes} />
    // </HashRouter>
  )
}

export default App
