import { baseConfig } from './base.js';

/**
 * Flat ESLint preset for packages that must be isomorphic (runnable in Node,
 * edge, and browser). Forbids Node- and browser-only globals and common
 * CommonJS sentinels so that stray `process.env` reads, `Buffer` usage, etc.
 * fail at lint time rather than at review time.
 *
 * See .cursor/rules/shared-purity.mdc.
 */
export const isomorphicConfig = [
  ...baseConfig,
  {
    languageOptions: { globals: { globalThis: 'readonly' } },
    rules: {
      'no-restricted-globals': [
        'error',
        {
          name: 'process',
          message: 'Isomorphic code must not read process.env; accept inputs as arguments.',
        },
        {
          name: 'Buffer',
          message: 'Buffer is Node-only; use Uint8Array / TextEncoder for binary data.',
        },
        {
          name: '__dirname',
          message: '__dirname is Node-only; isomorphic code must not depend on the filesystem.',
        },
        {
          name: '__filename',
          message: '__filename is Node-only; isomorphic code must not depend on the filesystem.',
        },
        {
          name: 'require',
          message: 'CommonJS require is not isomorphic; use ES module imports.',
        },
        {
          name: 'module',
          message: 'CommonJS module is not isomorphic; use ES module exports.',
        },
        {
          name: 'window',
          message: 'window is browser-only; isomorphic code must not reach into the DOM.',
        },
        {
          name: 'document',
          message: 'document is browser-only; isomorphic code must not reach into the DOM.',
        },
        {
          name: 'localStorage',
          message: 'localStorage is browser-only; isomorphic code must be stateless.',
        },
      ],
    },
  },
];

export default isomorphicConfig;
