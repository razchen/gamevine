import { nestConfig } from '@gamevine/eslint-config/nest';

export default [
  ...nestConfig,
  {
    ignores: ['dist/**', 'drizzle/**', 'coverage/**', 'eslint.config.mjs'],
  },
];
