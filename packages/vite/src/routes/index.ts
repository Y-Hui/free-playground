import { defineRoutes, lazyLoad } from '@kit/router'

export default defineRoutes([
  {
    path: '/',
    title: 'Focus',
    // redirectTo: '/basic',
    component: () => lazyLoad(() => import('@/focus/example/index')),
    // routes: [
    //   {
    //     path: '/basic',
    //     component: () => lazyLoad(() => import('@/focus/example/basic')),
    //   },
    // ],
  },
])
