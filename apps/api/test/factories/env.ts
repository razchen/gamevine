export const VALID_DATABASE_URL = 'postgres://postgres:postgres@localhost:5432/gamevine';

export const VALID_SENTRY_DSN = 'https://abc123@o1.ingest.sentry.io/42';

export function createValidRawEnv(
  overrides: Record<string, string | undefined> = {},
): Record<string, string | undefined> {
  return {
    NODE_ENV: 'test',
    PORT: '3001',
    DATABASE_URL: VALID_DATABASE_URL,
    CORS_ORIGIN: 'http://localhost:3000',
    ...overrides,
  };
}
