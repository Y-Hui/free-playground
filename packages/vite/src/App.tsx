import { RouterView } from '@kit/router'
import type { FC } from 'react'
import { HashRouter } from 'react-router-dom'

import routes from './routes'

const App: FC = () => {
  return (
    <HashRouter>
      <RouterView routes={routes} />
    </HashRouter>
  )
}

export default App
