import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import typescript from '@rollup/plugin-typescript';
import clear from 'rollup-plugin-clear';


const desc = '.runtime';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: 'src/install.ts',
      name: 'dd-vue3',
      formats: ['cjs', 'es', 'umd'],
      fileName: format => `dd-vue3.${format}.js`,

    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        },
        dir: 'lib',
        sourcemap: true,
      }
    },
    watch: {
      include: './src'
    }
  },
  plugins: [
    vue(),
    typescript({ tsconfig: './tsconfig.json' }),
    clear({
      targets: 'lib/*',
      watch: true
    })
  ]
})
