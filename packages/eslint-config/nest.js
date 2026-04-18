import globals from 'globals';
import { baseConfig } from './base.js';

/**
 * NestJS 11 ESLint flat config. Relaxes a few rules that conflict with Nest's
 * decorator-heavy patterns (empty constructors for DI, parameter decorators,
 * etc.) and scopes globals to Node/Jest.
 */
export const nestConfig = [
  ...baseConfig,
  {
    files: ['**/*.{ts,js}'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/no-empty-function': ['error', { allow: ['constructors'] }],
      '@typescript-eslint/no-unsafe-declaration-merging': 'off',
      // Nest's DI reads constructor parameter types at runtime via
      // reflect-metadata, so class imports used only in constructor signatures
      // are still runtime values. `consistent-type-imports` can't see this, so
      // we turn it off for the Nest surface.
      '@typescript-eslint/consistent-type-imports': 'off',
    },
  },
];

export default nestConfig;
