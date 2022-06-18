## @kit/router

配置式 React 路由。

### 路由配置

新建文件 `routes.tsx`：

```tsx
import { defineRoutes, lazyLoad } from '@kit/router'

const Loading = <div>Loading...</div>

const routes = defineRoutes([
  {
    path: '/',
    redirectTo: '/home',
  },
  {
    path: '/login',
    title: '登录',
    component: lazyLoad(() => import('@/views/login/index'), Loading),
  },
])
```

### RouterView

`<RouterView />` 是路由渲染容器。

```tsx
import { HashRouter } from 'react-router-dom'
import { RouterView } from '@kit/router'
import routes from './routes'

export default function App() {
  return (
    <HashRouter>
      <RouterView routes={routes} />
    </HashRouter>
  )
}
```

### RouteConfig 说明

🚧 TODO
