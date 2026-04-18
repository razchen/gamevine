import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { VALID_SENTRY_DSN, createValidRawEnv } from '../../test/factories/env';
import { AppConfigService } from './app-config.service';
import { validateEnv } from './env.validation';

async function makeService(
  overrides: Record<string, string | undefined> = {},
): Promise<AppConfigService> {
  const load = (): Record<string, unknown> => validateEnv(createValidRawEnv(overrides));
  const moduleRef = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        ignoreEnvFile: true,
        ignoreEnvVars: true,
        load: [load],
      }),
    ],
    providers: [AppConfigService],
  }).compile();

  return moduleRef.get(AppConfigService);
}

// Each getter should be a thin passthrough to ConfigService; the CORS_ORIGIN
// split/trim/filter logic is covered exhaustively in env.validation.spec.ts.
describe('AppConfigService', () => {
  it('exposes typed, passthrough getters for every env field', async () => {
    const svc = await makeService({ SENTRY_DSN: VALID_SENTRY_DSN });
    expect(svc.nodeEnv).toBe('test');
    expect(svc.port).toBe(3001);
    expect(svc.databaseUrl).toMatch(/^postgres:\/\//);
    expect(svc.corsOrigin).toEqual(['http://localhost:3000']);
    expect(svc.sentryDsn).toBe(VALID_SENTRY_DSN);
    expect(svc.isProduction).toBe(false);
  });

  it('returns undefined for sentryDsn when SENTRY_DSN is not set', async () => {
    const svc = await makeService();
    expect(svc.sentryDsn).toBeUndefined();
  });

  it('isProduction is true when NODE_ENV=production', async () => {
    // Use a non-localhost CORS_ORIGIN so the production superRefine passes.
    const svc = await makeService({
      NODE_ENV: 'production',
      CORS_ORIGIN: 'https://app.example.com',
    });
    expect(svc.isProduction).toBe(true);
    expect(svc.corsOrigin).toEqual(['https://app.example.com']);
  });
});
