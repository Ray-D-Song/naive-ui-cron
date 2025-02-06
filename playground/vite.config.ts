import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import { presetIcons } from 'unocss'

export default defineConfig({
  base: '/naive-ui-cron/',
  plugins: [
    vue(),
    vueJsx(),
    UnoCSS({
      presets: [
        presetIcons({
          scale: 1.2,
          cdn: 'https://esm.sh/'
        })
      ]
    })
  ],
  resolve: {
    alias: {
      'naive-ui-cron': '../src/index'
    }
  }
}) 