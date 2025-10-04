import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  server: {
    open: true,
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@atoms': path.resolve(__dirname, './src/components/Atoms'),
      '@molecules': path.resolve(__dirname, './src/components/Molecules'),
      '@organisms': path.resolve(__dirname, './src/components/Organisms'),
      '@ui': path.resolve(__dirname, './src/components/ui'),
      '@configs': path.resolve(__dirname, './src/configs'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
      '@redux': path.resolve(__dirname, './src/redux'),
      '@routes': path.resolve(__dirname, './src/routes'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@services': path.resolve(__dirname, './src/services'),
      '@themes': path.resolve(__dirname, './src/themes'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
    },
  },

})
