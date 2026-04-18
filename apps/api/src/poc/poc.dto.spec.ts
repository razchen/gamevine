import {
  CreateBugFixRunRequestSchema,
  CreateFeatureRunRequestSchema,
  CreateGenerationRunRequestSchema,
  TemplateConfigSchema,
} from './poc.dto';

describe('CreateGenerationRunRequestSchema', () => {
  it('accepts a minimal generation request', () => {
    const parsed = CreateGenerationRunRequestSchema.parse({
      templateId: 'breakout-basic',
    });

    expect(parsed).toEqual({
      templateId: 'breakout-basic',
    });
  });

  it('rejects nested template ids', () => {
    expect(() =>
      CreateGenerationRunRequestSchema.parse({
        templateId: 'games/breakout',
      }),
    ).toThrow(/Template IDs/);
  });
});

describe('CreateFeatureRunRequestSchema', () => {
  it('requires a source run id', () => {
    const parsed = CreateFeatureRunRequestSchema.parse({
      sourceRunId: '2026-04-18T21-55-43.359Z--02762677',
    });

    expect(parsed.sourceRunId).toBe('2026-04-18T21-55-43.359Z--02762677');
  });

  it('rejects an empty source run id', () => {
    expect(() =>
      CreateFeatureRunRequestSchema.parse({
        sourceRunId: '   ',
      }),
    ).toThrow(/sourceRunId/i);
  });

  it('rejects a path-like source run id', () => {
    expect(() =>
      CreateFeatureRunRequestSchema.parse({
        sourceRunId: '../../tmp/run',
      }),
    ).toThrow(/run format/i);
  });
});

describe('CreateBugFixRunRequestSchema', () => {
  it('accepts a valid bug-fix source run id', () => {
    const parsed = CreateBugFixRunRequestSchema.parse({
      sourceRunId: '2026-04-18T21-55-43.359Z--02762677',
    });

    expect(parsed.sourceRunId).toBe('2026-04-18T21-55-43.359Z--02762677');
  });
});

describe('TemplateConfigSchema', () => {
  it('accepts a template-owned allowlist and static build output config', () => {
    const parsed = TemplateConfigSchema.parse({
      name: 'Arcade Canvas Starter',
      editableFiles: ['src/index.html', 'src/main.js', 'src/styles.css'],
      staticBuild: {
        outputDir: 'dist',
        entryHtml: 'dist/index.html',
      },
    });

    expect(parsed.staticBuild.entryHtml).toBe('dist/index.html');
  });

  it('rejects duplicate editable file paths', () => {
    expect(() =>
      TemplateConfigSchema.parse({
        name: 'Arcade Canvas Starter',
        editableFiles: ['src/main.js', 'src/main.js'],
        staticBuild: {
          outputDir: 'dist',
          entryHtml: 'dist/index.html',
        },
      }),
    ).toThrow(/unique/);
  });
});
