/* eslint-disable import/no-extraneous-dependencies */
import { babel } from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import serve from 'rollup-plugin-serve';

// TODO: Wait once this issue will be fixed before update the terser plugin https://github.com/rollup/plugins/issues/1371
// TODO: Remove this hack once this issue will be resolved https://github.com/rollup/plugins/issues/1366
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
global['__filename'] = __filename;

import data from './package.json' assert { type: 'json' };

const year = new Date().getFullYear();

function getHeader() {
  return `/*!
 * ivents v${data.version} (${data.homepage})
 * Copyright ${year} ${data.author}
 * Licensed under MIT (https://github.com/nk-crew/ivents/blob/master/LICENSE)
 */
`;
}

const input = './src/ivents.js';

const bundles = [
  {
    input,
    output: {
      banner: getHeader(),
      file: './dist/ivents.esm.js',
      format: 'esm',
    },
  },
  {
    input,
    output: {
      banner: getHeader(),
      file: './dist/ivents.esm.min.js',
      format: 'esm',
      compact: true,
    },
  },
  {
    input,
    output: {
      banner: getHeader(),
      name: 'ivents',
      file: './dist/ivents.js',
      format: 'umd',
    },
  },
  {
    input,
    output: {
      banner: getHeader(),
      name: 'ivents',
      file: './dist/ivents.min.js',
      format: 'umd',
      compact: true,
    },
  },
  {
    input,
    output: {
      banner: getHeader(),
      file: './dist/ivents.cjs',
      format: 'cjs',
      exports: 'named',
    },
  },
  {
    input,
    output: {
      banner: getHeader(),
      file: './dist/ivents.cjs',
      format: 'cjs',
      exports: 'named',
      compact: true,
    },
  },
];

const isDev = () => process.env.NODE_ENV === 'dev';
const isUMD = (file) => file.includes('ivents.js');
const isMinEnv = (file) => file.includes('.min.');
const isSpecificEnv = (file) => isMinEnv(file);
const isDebugAlways = (file) => (isDev() || isUMD(file) ? 'true' : 'false');

const configs = bundles.map(({ input: inputPath, output }) => ({
  input: inputPath,
  output,
  plugins: [
    babel({
      babelHelpers: 'bundled',
      plugins: ['annotate-pure-calls'],
    }),
    replace({
      __DEV__: isSpecificEnv(output.file)
        ? isDebugAlways(output.file)
        : 'process.env.NODE_ENV !== "production"',
      preventAssignment: true,
    }),
    output.file.includes('.min.') && terser(),
  ],
}));

// Dev server.
if (isDev()) {
  configs[configs.length - 1].plugins.push(
    serve({
      open: true,
      contentBase: ['demo', './'],
      port: 3002,
    })
  );
}

export default configs;
