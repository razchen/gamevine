import { VALID_DATABASE_URL, VALID_SENTRY_DSN, createValidRawEnv } from '../../test/factories/env';
import { validateEnv } from './env.validation';

describe('validateEnv', () => {
  it('accepts a minimal valid env and coerces numeric PORT', () => {
    const env = validateEnv(createValidRawEnv({ NODE_ENV: 'development' }));
    expect(env.NODE_ENV).toBe('development');
    expect(env.PORT).toBe(3001);
    expect(env.DATABASE_URL).toBe(VALID_DATABASE_URL);
    expect(env.CORS_ORIGIN).toEqual(['http://localhost:3000']);
    expect(env.SENTRY_DSN).toBeUndefined();
  });

  it('applies defaults for NODE_ENV, PORT, and CORS_ORIGIN', () => {
    const env = validateEnv({ DATABASE_URL: VALID_DATABASE_URL });
    expect(env.NODE_ENV).toBe('development');
    expect(env.PORT).toBe(3001);
    expect(env.CORS_ORIGIN).toEqual(['http://localhost:3000']);
  });

  it('splits, trims, and drops empty entries from CORS_ORIGIN', () => {
    const env = validateEnv(
      createValidRawEnv({
        CORS_ORIGIN:
          'http://localhost:3000, https://app.example.com ,,  https://staging.example.com',
      }),
    );
    expect(env.CORS_ORIGIN).toEqual([
      'http://localhost:3000',
      'https://app.example.com',
      'https://staging.example.com',
    ]);
  });

  it('accepts a valid SENTRY_DSN', () => {
    const env = validateEnv(createValidRawEnv({ SENTRY_DSN: VALID_SENTRY_DSN }));
    expect(env.SENTRY_DSN).toBe(VALID_SENTRY_DSN);
  });

  it('rejects a missing DATABASE_URL', () => {
    expect(() => validateEnv({ NODE_ENV: 'development' })).toThrow(/DATABASE_URL/);
  });

  it('rejects a DATABASE_URL with the wrong protocol', () => {
    expect(() =>
      validateEnv(createValidRawEnv({ DATABASE_URL: 'mysql://user:pw@localhost:3306/db' })),
    ).toThrow(/postgres/);
  });

  it('does not echo the rejected DATABASE_URL value in the error message', () => {
    // Negative test — validation errors must never leak secret values into logs.
    const bad = 'mysql://super:s3cret-pw@host/db';
    let caught: Error | undefined;
    try {
      validateEnv(createValidRawEnv({ DATABASE_URL: bad }));
    } catch (err) {
      caught = err as Error;
    }
    expect(caught).toBeDefined();
    expect(caught?.message).not.toContain('s3cret-pw');
    expect(caught?.message).not.toContain('super:s3cret-pw');
  });

  it('rejects PORT below 1', () => {
    expect(() => validateEnv(createValidRawEnv({ PORT: '0' }))).toThrow(/PORT/);
  });

  it('rejects PORT above 65535', () => {
    expect(() => validateEnv(createValidRawEnv({ PORT: '70000' }))).toThrow(/PORT/);
  });

  it('rejects a non-numeric PORT', () => {
    expect(() => validateEnv(createValidRawEnv({ PORT: 'not-a-port' }))).toThrow(/PORT/);
  });

  it('rejects CORS_ORIGIN="*" (would be a wildcard trap with credentials: true)', () => {
    expect(() => validateEnv(createValidRawEnv({ CORS_ORIGIN: '*' }))).toThrow(/CORS_ORIGIN/);
  });

  it('rejects CORS_ORIGIN entries with trailing slash or path', () => {
    expect(() => validateEnv(createValidRawEnv({ CORS_ORIGIN: 'http://localhost:3000/' }))).toThrow(
      /bare origin/,
    );
    expect(() =>
      validateEnv(createValidRawEnv({ CORS_ORIGIN: 'http://localhost:3000/app' })),
    ).toThrow(/bare origin/);
  });

  it('rejects CORS_ORIGIN entries without a protocol', () => {
    expect(() => validateEnv(createValidRawEnv({ CORS_ORIGIN: 'localhost:3000' }))).toThrow(
      /bare origin|Invalid URL/,
    );
  });

  it('rejects localhost CORS_ORIGIN in production', () => {
    expect(() =>
      validateEnv(
        createValidRawEnv({
          NODE_ENV: 'production',
          CORS_ORIGIN: 'http://localhost:3000',
        }),
      ),
    ).toThrow(/production/);
  });

  it('allows non-localhost CORS_ORIGIN in production', () => {
    const env = validateEnv(
      createValidRawEnv({
        NODE_ENV: 'production',
        CORS_ORIGIN: 'https://app.example.com',
      }),
    );
    expect(env.NODE_ENV).toBe('production');
    expect(env.CORS_ORIGIN).toEqual(['https://app.example.com']);
  });

  it('rejects an invalid SENTRY_DSN', () => {
    expect(() => validateEnv(createValidRawEnv({ SENTRY_DSN: 'not-a-url' }))).toThrow(/SENTRY_DSN/);
  });

  it('rejects a SENTRY_DSN missing the public key userinfo', () => {
    expect(() => validateEnv(createValidRawEnv({ SENTRY_DSN: 'https://sentry.io/42' }))).toThrow(
      /SENTRY_DSN/,
    );
  });

  it('rejects a SENTRY_DSN missing the project id path', () => {
    expect(() => validateEnv(createValidRawEnv({ SENTRY_DSN: 'https://abc@sentry.io' }))).toThrow(
      /SENTRY_DSN/,
    );
  });

  it('rejects an unknown NODE_ENV', () => {
    expect(() => validateEnv(createValidRawEnv({ NODE_ENV: 'staging' }))).toThrow(/NODE_ENV/);
  });
});
