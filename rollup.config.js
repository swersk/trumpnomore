import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import css from 'rollup-plugin-css-only';
import copy from 'rollup-plugin-copy';

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
      typescript({
        tsconfig: "./tsconfig.json",
        importHelpers: true,  // Enables tslib helper functions
        tslib: require.resolve('tslib')
      }),
      css({ output: 'dist/content.css' }),  // Extracts CSS to a file in dist folder
      copy({
        targets: [
          { src: 'src/options.html', dest: 'dist' },
          { src: 'src/popup.html', dest: 'dist' },
          { src: 'images/*', dest: 'dist/images' }
        ]
      })
    ]
  },
  {
    input: 'src/popup.ts',   
    output: {
      file: 'dist/popup.js',   
      format: 'iife',
      name: 'PopupScript'
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
        importHelpers: true,
        tslib: require.resolve('tslib')
      })
    ]
  }
];
