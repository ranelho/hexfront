import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega as variáveis de ambiente baseado no modo
  const env = loadEnv(mode, process.cwd(), '');
  
  console.log('🔧 Vite Config - Variáveis de ambiente:', {
    VITE_API_PATH: env.VITE_API_PATH,
    VITE_PROXY_TARGET: env.VITE_PROXY_TARGET,
    mode: mode
  });
  
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/hex/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('❌ Proxy error:', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('📤 Proxy Request:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('📥 Proxy Response:', proxyRes.statusCode, req.url);
            });
          },
        },
      },
    },
  };
})
