import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json';
import { eslint } from 'rollup-plugin-eslint';
const { uglify } = require('rollup-plugin-uglify');
const isProd = process.env.NODE_ENV === 'production';
export default {
  input: pkg.src,
  output: {
    file: pkg.main,
    format: 'umd',
    name: 'Charts3D',
    globals: {
      d3: 'd3'
    },
    sourcemap: !isProd
  },
  // external: id => /lodash/.test(id) // 也可以使用这种方式
  external: ['d3'],
  watch: {
    include: 'src/**'
  },
  plugins: [
    !isProd && eslint(),
    resolve(),
    commonjs(),
    json(),
    babel({
      include: ['src/**'],
      externalHelpers: true
    }),
    isProd && uglify()
  ]
};
