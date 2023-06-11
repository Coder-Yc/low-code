import { defineConfig } from 'vite'
import commonjs from 'vite-plugin-commonjs';
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(),  commonjs(),],
  esbuild: { loader: { '.js': '.jsx' } },
  define: {
    'process.env': process.env
  }
})
