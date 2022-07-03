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
      targets: 'lib',
    })
  ]
})
