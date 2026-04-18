import { z } from 'zod';

const OriginEntry = z
  .string()
  .refine((v) => v !== '*', {
    message: 'CORS_ORIGIN cannot be "*" because credentials are enabled; list explicit origins',
  })
  .refine(
    (v) => {
      try {
        const u = new URL(v);
        return (u.protocol === 'http:' || u.protocol === 'https:') && v === u.origin;
      } catch {
        return false;
      }
    },
    {
      message:
        'Each CORS_ORIGIN entry must be a bare origin like https://app.example.com (no path, no trailing slash)',
    },
  );

const SentryDsn = z
  .string()
  .url()
  .refine(
    (v) => {
      try {
        const u = new URL(v);
        return (
          (u.protocol === 'https:' || u.protocol === 'http:') &&
          u.username.length > 0 &&
          u.pathname.length > 1
        );
      } catch {
        return false;
      }
    },
    {
      message: 'SENTRY_DSN must be a valid DSN of the form https://<key>@<host>/<project-id>',
    },
  )
  .optional();

const AiBaseUrl = z
  .string()
  .trim()
  .url()
  .refine((value) => {
    const url = new URL(value);
    if (url.protocol === 'https:') {
      return true;
    }

    return (
      url.protocol === 'http:' && (url.hostname === 'localhost' || url.hostname === '127.0.0.1')
    );
  }, 'AI_BASE_URL must use https unless it targets localhost for local development');

export const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().min(1).max(65535).default(3001),
    DATABASE_URL: z
      .string()
      .min(1, 'DATABASE_URL is required')
      .refine(
        (v) => v.startsWith('postgres://') || v.startsWith('postgresql://'),
        'DATABASE_URL must be a postgres:// or postgresql:// connection string',
      ),
    CORS_ORIGIN: z
      .string()
      .default('http://localhost:3000')
      .transform((s) =>
        s
          .split(',')
          .map((o) => o.trim())
          .filter(Boolean),
      )
      .pipe(z.array(OriginEntry).min(1, 'CORS_ORIGIN must contain at least one origin')),
    SENTRY_DSN: SentryDsn,
    AI_API_KEY: z.string().trim().min(1).optional(),
    AI_MODEL: z.string().trim().min(1).optional(),
    AI_BASE_URL: AiBaseUrl.default('https://openrouter.ai/api/v1'),
    POC_API_ENABLED: z
      .enum(['true', 'false'])
      .default('false')
      .transform((value) => value === 'true'),
    POC_MAX_CONCURRENT_RUNS: z.coerce.number().int().positive().default(1),
    POC_RUNS_DIR: z.string().trim().min(1).default('.gamevine/poc-runs'),
    POC_TEMPLATES_ROOT: z.string().trim().min(1).default('.gamevine/poc-templates'),
  })
  .superRefine((env, ctx) => {
    if (
      env.NODE_ENV === 'production' &&
      env.CORS_ORIGIN.some((o) => o.includes('localhost') || o.includes('127.0.0.1'))
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['CORS_ORIGIN'],
        message: 'CORS_ORIGIN must not contain localhost or 127.0.0.1 in production',
      });
    }
  });

export type Env = z.infer<typeof envSchema>;

export function validateEnv(raw: Record<string, unknown>): Env {
  const result = envSchema.safeParse(raw);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  - ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n');
    throw new Error(`Invalid environment variables:\n${issues}`);
  }
  return result.data;
}
