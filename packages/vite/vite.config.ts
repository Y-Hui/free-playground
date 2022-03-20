import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig, loadEnv } from 'vite'

function pathResolve(dir: string) {
  return resolve(__dirname, '.', dir)
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const { VITE_PROXY_DOMAIN, VITE_REQUEST_URL } = loadEnv(mode, process.cwd())

  return {
    define: {
      __DEV__: mode !== 'production',
    },
    resolve: {
      alias: [
        {
          find: /@\//,
          replacement: `${pathResolve('src')}/`,
        },
      ],
    },
    server: {
      proxy: {
        [VITE_REQUEST_URL]: {
          target: VITE_PROXY_DOMAIN,
          changeOrigin: true,
          rewrite: (path) =>
            path.replace(new RegExp(`^\\${VITE_REQUEST_URL}`), ''),
        },
      },
    },
    plugins: [react(), mode === 'production' && visualizer({ open: true })],
  }
})
