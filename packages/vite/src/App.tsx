import 'antd/dist/antd.css'

// import { RouterView } from '@kit/router'
import type { FC } from 'react'
import { useEffect, useState } from 'react'

// import { HashRouter } from 'react-router-dom'
import Content from './focus/index.page'
// import routes from './routes'

const Count = () => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    console.log('mount', count)
    return () => {
      console.log('unmount', count)
    }
  }, [count])
  return <button onClick={() => setCount((v) => v + 1)}>{count}</button>
}

const App: FC = () => {
  return (
    <>
      {/* <Count /> */}
      <Content />
    </>
    // <HashRouter>
    //   <RouterView routes={routes} />
    // </HashRouter>
  )
}

export default App
