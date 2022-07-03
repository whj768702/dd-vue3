import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import typescript from '@rollup/plugin-typescript';
import clear from 'rollup-plugin-clear';
// import typescript2 from 'rollup-plugin-typescript2';

const desc = '.runtime';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    cssCodeSplit: false,
    lib: {
      entry: 'src/DdVue3.ts',
      name: 'DdVue3',
      formats: ['cjs', 'es', 'umd'],
      fileName: format => {
        if (format === 'cjs') {
          return 'index.cjs';
        } else if (format === 'es') {
          return 'index.js';
        } else {
          return 'index.js';
        }
      }
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        },
        dir: 'dist',
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
    // typescript2({
    //  tsconfigOverride: {
    //    compilerOptions: {
    //      declaration: true,
    //      declarationMap: true,
    //    },
    //    exclude: ['vite.config.ts']
    //  }
    // }),
    clear({
      targets: ['dist/*'],
    })
  ]
})
