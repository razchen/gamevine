import { posix } from 'node:path';
import { z } from 'zod';

function hasUniqueEntries(values: string[]): boolean {
  return new Set(values).size === values.length;
}

export const RelativeTemplatePathSchema = z
  .string()
  .trim()
  .min(1)
  .transform((value, ctx) => {
    if (value.startsWith('/') || value.includes('\\')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'File paths must be relative to the template root',
      });
      return z.NEVER;
    }

    const normalized = posix.normalize(value);
    if (
      normalized === '.' ||
      normalized.startsWith('../') ||
      normalized.split('/').some((segment) => segment === '' || segment === '.' || segment === '..')
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'File paths must stay within the template root',
      });
      return z.NEVER;
    }

    return normalized;
  });

export const CreateGenerationRunRequestSchema = z.object({
  templateId: z
    .string()
    .trim()
    .min(1)
    .refine(
      (value) => !value.includes('/') && !value.includes('\\') && value !== '.' && value !== '..',
      {
        message: 'Template IDs must be simple directory names',
      },
    ),
  model: z.string().trim().min(1).optional(),
});

export type CreateGenerationRunRequest = z.infer<typeof CreateGenerationRunRequestSchema>;

const RunIdSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}\.\d{3}Z--[0-9a-f]{8}$/, {
    message: 'Run IDs must match the generated POC run format',
  });

export const CreateSourceRunRequestSchema = z.object({
  sourceRunId: RunIdSchema,
  model: z.string().trim().min(1).optional(),
});

export type CreateSourceRunRequest = z.infer<typeof CreateSourceRunRequestSchema>;
export const CreateFeatureRunRequestSchema = CreateSourceRunRequestSchema;
export type CreateFeatureRunRequest = CreateSourceRunRequest;
export const CreateBugFixRunRequestSchema = CreateSourceRunRequestSchema;
export type CreateBugFixRunRequest = CreateSourceRunRequest;

export const GenerationRunResponseSchema = z.object({
  runId: z.string(),
  templateId: z.string(),
  model: z.string(),
  changedFiles: z.array(z.string()),
  summary: z.string(),
  staticBuild: z.object({
    outputDir: z.string(),
    entryHtml: z.string(),
  }),
  preview: z
    .object({
      url: z.string().url(),
      port: z.number().int().positive(),
    })
    .nullable(),
  usage: z.object({
    inputTokens: z.number().int().nonnegative(),
    outputTokens: z.number().int().nonnegative(),
    totalTokens: z.number().int().nonnegative(),
  }),
  requestDurationMs: z.number().int().nonnegative(),
  build: z.object({
    success: z.boolean(),
    command: z.array(z.string()),
    exitCode: z.number().int(),
    durationMs: z.number().int().nonnegative(),
    timedOut: z.boolean(),
    logFile: z.string(),
  }),
});

export type GenerationRunResponse = z.infer<typeof GenerationRunResponseSchema>;

export const ModelFileWriteSchema = z.object({
  path: RelativeTemplatePathSchema,
  content: z.string(),
});

export type ModelFileWrite = z.infer<typeof ModelFileWriteSchema>;

export const ModelGenerationResultSchema = z.object({
  summary: z.string().trim().min(1),
  files: z
    .array(ModelFileWriteSchema)
    .min(1)
    .refine((files) => hasUniqueEntries(files.map((file) => file.path)), {
      message: 'Model output file paths must be unique',
    }),
});

export type ModelGenerationResult = z.infer<typeof ModelGenerationResultSchema>;

export const TemplateConfigSchema = z.object({
  name: z.string().trim().min(1),
  editableFiles: z.array(RelativeTemplatePathSchema).min(1).refine(hasUniqueEntries, {
    message: 'Editable file paths must be unique',
  }),
  staticBuild: z.object({
    outputDir: RelativeTemplatePathSchema,
    entryHtml: RelativeTemplatePathSchema,
  }),
});

export type TemplateConfig = z.infer<typeof TemplateConfigSchema>;
