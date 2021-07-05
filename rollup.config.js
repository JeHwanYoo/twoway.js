import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import json from '@rollup/plugin-json'

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/twoway.min.js',
        format: 'umd',
        name: 'Twoway',
        globals: {
          fs: 'fs',
          handlebars: 'handlebars',
          htmlparser2: 'htmlparser2',
          randomstring: 'randomstring',
          crypto: 'crypto',
        },
        sourcemap: true,
        compact: true,
        plugins: [terser()],
      },
      {
        file: 'dist/twoway.js',
        format: 'umd',
        name: 'Twoway',
        globals: {
          fs: 'fs',
          handlebars: 'handlebars',
          htmlparser2: 'htmlparser2',
          randomstring: 'randomstring',
          crypto: 'crypto',
        },
        sourcemap: true,
        compact: true,
      },
    ],
    plugins: [
      typescript({
        module: 'esnext',
        target: 'esnext',
        allowSyntheticDefaultImports: true,
      }),
      nodeResolve(),
      commonjs(),
      json(),
    ],
  },
]
