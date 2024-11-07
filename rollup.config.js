import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import css from 'rollup-plugin-css-only';

export default [
  {
    input: 'src/content.ts',
    output: {
      file: 'dist/content.js',
      format: 'iife',
      name: 'ContentScript'
    },
    plugins: [
        resolve(),
        commonjs(),
        typescript(),
        css({ output: 'dist/content.css' })  // Extracts CSS to a file in dist folder
      ]  } 
];
