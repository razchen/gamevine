import globals from 'globals';
import { baseConfig } from './base.js';

/**
 * Next.js 16 ESLint flat config. `eslint-config-next` is resolved lazily so
 * this file remains useful even if consuming apps pin a different Next major.
 *
 * Note: Next.js 16 removed the `next lint` command; each app should run
 * `eslint .` directly. Plugin rules are applied via the shared config below.
 */
const nextPlugin = (await import('@next/eslint-plugin-next')).default;

export const nextConfig = [
  ...baseConfig,
  {
    plugins: { '@next/next': nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'react-hooks/rules-of-hooks': 'off',
    },
  },
];

export default nextConfig;
