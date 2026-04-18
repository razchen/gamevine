import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Env } from './env.validation';

/**
 * Thin, type-safe facade over Nest's ConfigService. Using this instead of the
 * raw ConfigService everywhere keeps env access strictly typed and makes the
 * full env shape easy to discover.
 */
@Injectable()
export class AppConfigService {
  constructor(private readonly config: ConfigService<Env, true>) {}

  get nodeEnv(): Env['NODE_ENV'] {
    return this.config.get('NODE_ENV', { infer: true });
  }

  get port(): number {
    return this.config.get('PORT', { infer: true });
  }

  get databaseUrl(): string {
    return this.config.get('DATABASE_URL', { infer: true });
  }

  get corsOrigin(): string[] {
    return this.config.get('CORS_ORIGIN', { infer: true });
  }

  get sentryDsn(): string | undefined {
    return this.config.get('SENTRY_DSN', { infer: true });
  }

  get aiApiKey(): string | undefined {
    return this.config.get('AI_API_KEY', { infer: true });
  }

  get aiModel(): string | undefined {
    return this.config.get('AI_MODEL', { infer: true });
  }

  get aiBaseUrl(): string {
    return this.config.get('AI_BASE_URL', { infer: true });
  }

  get pocApiEnabled(): boolean {
    return this.config.get('POC_API_ENABLED', { infer: true });
  }

  get pocMaxConcurrentRuns(): number {
    return this.config.get('POC_MAX_CONCURRENT_RUNS', { infer: true });
  }

  get pocRunsDir(): string {
    return this.config.get('POC_RUNS_DIR', { infer: true });
  }

  get pocTemplatesRoot(): string {
    return this.config.get('POC_TEMPLATES_ROOT', { infer: true });
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }
}
