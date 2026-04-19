import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { request as httpRequest } from 'node:http';
import { join, resolve } from 'node:path';
import { BadGatewayException } from '@nestjs/common';
import type { AppConfigService } from '../config/app-config.service';
import type { GenerationRunResponse } from './poc.dto';
import {
  assertAllowedOutputPaths,
  extractOutputText,
  parseModelResponse,
  PocService,
  stripMarkdownFences,
} from './poc.service';

describe('poc.service helpers', () => {
  describe('extractOutputText', () => {
    it('joins output_text fragments from the response', () => {
      expect(
        extractOutputText({
          output: [
            {
              content: [
                { type: 'output_text', text: '{"summary":"done",' },
                { type: 'output_text', text: '"files":[]}' },
              ],
            },
          ],
        }),
      ).toBe('{"summary":"done",\n"files":[]}');
    });
  });

  describe('stripMarkdownFences', () => {
    it('removes a json code fence wrapper', () => {
      expect(stripMarkdownFences('```json\n{"ok":true}\n```')).toBe('{"ok":true}');
    });
  });

  describe('parseModelResponse', () => {
    it('parses fenced json into a validated file set', () => {
      expect(
        parseModelResponse(`\`\`\`json
{"summary":"Updated the game","files":[{"path":"src/main.js","content":"export const ok = true;\\n"}]}
\`\`\``),
      ).toEqual({
        summary: 'Updated the game',
        files: [{ path: 'src/main.js', content: 'export const ok = true;\n' }],
      });
    });

    it('throws when the model returns invalid json', () => {
      expect(() => parseModelResponse('not json')).toThrow(BadGatewayException);
    });

    it('throws when the model returns duplicate output paths', () => {
      expect(() =>
        parseModelResponse(
          '{"summary":"Updated","files":[{"path":"src/main.js","content":"a"},{"path":"src/main.js","content":"b"}]}',
        ),
      ).toThrow(BadGatewayException);
    });
  });

  describe('assertAllowedOutputPaths', () => {
    it('accepts files within the allowed set', () => {
      expect(() =>
        assertAllowedOutputPaths(
          [{ path: 'src/main.js', content: 'export const ok = true;\n' }],
          ['src/main.js'],
        ),
      ).not.toThrow();
    });

    it('throws when the model tries to edit an unapproved file', () => {
      expect(() =>
        assertAllowedOutputPaths([{ path: 'package.json', content: '{}' }], ['src/main.js']),
      ).toThrow(BadGatewayException);
    });
  });
});

describe('PocService flows', () => {
  const originalFetch = global.fetch;
  const repoRoot = resolve(process.cwd(), '..', '..');
  const services: PocService[] = [];
  const tempRoots: string[] = [];

  afterEach(async () => {
    global.fetch = originalFetch;

    await Promise.all(
      services.splice(0, services.length).map((service) => service.onModuleDestroy()),
    );
    await Promise.all(
      tempRoots.splice(0, tempRoots.length).map(async (path) => {
        await rm(path, { recursive: true, force: true });
      }),
    );
  });

  it('writes failed status artifacts when the model returns no output text', async () => {
    const { service, runsDir, templateId } = await makeService();
    global.fetch = jest.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          model: 'gpt-5.2',
          output: [],
          usage: {
            input_tokens: 1,
            output_tokens: 1,
            total_tokens: 2,
          },
        }),
        { status: 200 },
      ),
    );

    await expect(
      service.createGenerationRun({
        templateId,
      }),
    ).rejects.toThrow(/output text/);

    const status = await readLatestStatus(runsDir);
    expect(status.phase).toBe('model');
    expect(status.status).toBe('failed');
  });

  it('writes failed status artifacts when token usage is missing', async () => {
    const { service, runsDir, templateId } = await makeService();
    global.fetch = jest.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          model: 'gpt-5.2',
          output: [
            {
              content: [
                {
                  type: 'output_text',
                  text: '{"summary":"Updated","files":[{"path":"src/main.js","content":"document.body.dataset.state = \\"updated\\";\\n"}]}',
                },
              ],
            },
          ],
        }),
        { status: 200 },
      ),
    );

    await expect(
      service.createGenerationRun({
        templateId,
      }),
    ).rejects.toThrow(/token usage/);

    const status = await readLatestStatus(runsDir);
    expect(status.phase).toBe('usage');
    expect(status.status).toBe('failed');
  });

  it('marks the run as failed when the fixed build command exits non-zero', async () => {
    const { service, runsDir, templateId } = await makeService({
      buildScript: 'node -e "process.exit(1)"',
    });
    global.fetch = jest.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          model: 'gpt-5.2',
          output: [
            {
              content: [
                {
                  type: 'output_text',
                  text: '{"summary":"Updated","files":[{"path":"src/main.js","content":"document.body.dataset.state = \\"updated\\";\\n"}]}',
                },
              ],
            },
          ],
          usage: {
            prompt_tokens: 10,
            completion_tokens: 20,
            total_tokens: 30,
          },
        }),
        { status: 200 },
      ),
    );

    const result = await service.createGenerationRun({
      templateId,
    });

    expect(result.build.success).toBe(false);
    expect(result.build.exitCode).toBe(1);
    expect(result.preview).toBeNull();

    const status = await readLatestStatus(runsDir);
    expect(status.status).toBe('failed');
    expect(status.build).toEqual({ exitCode: 1, timedOut: false });
  });

  it('completes a successful generation run, records static build output, and serves a preview', async () => {
    const { service, runsDir, templateId } = await makeService();
    global.fetch = jest.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          model: 'gpt-5.2',
          output: [
            {
              content: [
                {
                  type: 'output_text',
                  text: JSON.stringify({
                    summary: 'Generate a simple Breakout game',
                    files: [
                      {
                        path: 'src/main.js',
                        content:
                          'document.body.innerHTML = "<main><h1>Breakout Ready</h1><p>Press Space to start.</p></main>";\n',
                      },
                    ],
                  }),
                },
              ],
            },
          ],
          usage: {
            prompt_tokens: 10,
            completion_tokens: 20,
            total_tokens: 30,
          },
        }),
        { status: 200 },
      ),
    );

    const result = await service.createGenerationRun({
      templateId,
    });

    expect(result.build.success).toBe(true);
    expect(result.changedFiles).toEqual(['src/main.js']);
    expect(result.staticBuild).toEqual({
      outputDir: 'dist',
      entryHtml: 'dist/index.html',
    });
    expect(result.preview?.url).toMatch(/^http:\/\/127\.0\.0\.1:\d+\/$/);

    await expect(readFile(join(runsDir, result.runId, 'prompt.txt'), 'utf8')).resolves.toContain(
      'Create a small arcade-style browser game: Breakout.',
    );
    await expect(readFile(join(runsDir, result.runId, 'request.json'), 'utf8')).resolves.toContain(
      'Only modify files that appear in the provided TEMPLATE FILES or CURRENT FILES section.',
    );
    await expect(
      readFile(join(runsDir, result.runId, 'workspace', 'src', 'main.js'), 'utf8'),
    ).resolves.toContain('Breakout Ready');
    await expect(
      readFile(join(runsDir, result.runId, 'workspace', 'dist', 'index.html'), 'utf8'),
    ).resolves.toContain('<script type="module" src="./main.js"></script>');

    const previewRoot = await fetchResponse(result.preview?.url ?? '');
    expect(previewRoot.body).toContain('Gamevine Arcade Template');

    const previewMainJs = await fetchResponse(
      new URL('/main.js', result.preview?.url ?? '').toString(),
    );
    expect(previewMainJs.statusCode).toBe(200);
    expect(previewMainJs.headers['cache-control']).toBe('no-store');
    expect(previewMainJs.headers['content-type']).toContain('text/javascript');

    const previewStyles = await fetchResponse(
      new URL('/styles.css', result.preview?.url ?? '').toString(),
    );
    expect(previewStyles.statusCode).toBe(200);
    expect(previewStyles.headers['content-type']).toContain('text/css');

    const previewSpaFallback = await fetchResponse(
      new URL('/play/level-1', result.preview?.url ?? '').toString(),
    );
    expect(previewSpaFallback.statusCode).toBe(200);
    expect(previewSpaFallback.body).toContain('Gamevine Arcade Template');

    const previewTraversal = await fetchResponse(
      `${result.preview?.url ?? ''}%2e%2e/%2e%2e/package.json`,
    );
    expect(previewTraversal.statusCode).toBe(404);
    expect(previewTraversal.body).toBe('Not found');
  });

  it('fails when build succeeds but the static output directory is missing', async () => {
    const { service, templateId } = await makeService({
      buildScript: 'node -e "console.log(\'done\')"',
    });
    global.fetch = jest.fn().mockResolvedValue(successfulModelResponse());

    await expect(
      service.createGenerationRun({
        templateId,
      }),
    ).rejects.toThrow(/output directory is missing/);
  });

  it('fails when build succeeds but the static entry html is missing', async () => {
    const { service, templateId } = await makeService({
      buildFileContent: [
        "import { mkdir, rm } from 'node:fs/promises';",
        '',
        "await rm(new URL('./dist/', import.meta.url), { force: true, recursive: true });",
        "await mkdir(new URL('./dist/', import.meta.url), { recursive: true });",
        '',
      ].join('\n'),
    });
    global.fetch = jest.fn().mockResolvedValue(successfulModelResponse());

    await expect(
      service.createGenerationRun({
        templateId,
      }),
    ).rejects.toThrow(/entry HTML is missing/);
  });

  it('uses the package-local build script for workspaces copied under the repo', async () => {
    const { service, templateId } = await makeService({
      rootParent: join(repoRoot, '.gamevine'),
    });
    global.fetch = jest.fn().mockResolvedValue(successfulModelResponse());

    const result = await service.createGenerationRun({
      templateId,
    });

    expect(result.build.success).toBe(true);
    expect(result.build.command).toEqual(['sh', '-lc', 'node build.mjs']);
    expect(result.preview).not.toBeNull();
  });

  it.each([{ templateId: 'breakout-basic' }])(
    'reads only the tracked template allowlist from the real template config for $templateId',
    async ({ templateId }) => {
      const trackedTemplatesRoot = resolve(repoRoot, '.gamevine/poc-templates');
      const runsParent = join(repoRoot, '.gamevine');
      await mkdir(runsParent, { recursive: true });
      const runsRoot = await mkdtemp(join(runsParent, 'gamevine-poc-real-template-'));
      tempRoots.push(runsRoot);
      const templateConfig = JSON.parse(
        await readFile(join(trackedTemplatesRoot, templateId, 'template.config.json'), 'utf8'),
      ) as {
        editableFiles: string[];
      };

      const config = {
        isProduction: false,
        aiApiKey: 'test-key',
        aiBaseUrl: 'https://openrouter.ai/api/v1',
        aiModel: 'gpt-5.2',
        pocApiEnabled: true,
        pocMaxConcurrentRuns: 1,
        pocRunsDir: join(runsRoot, 'runs'),
        pocTemplatesRoot: trackedTemplatesRoot,
      } satisfies Pick<
        AppConfigService,
        | 'isProduction'
        | 'aiApiKey'
        | 'aiBaseUrl'
        | 'aiModel'
        | 'pocApiEnabled'
        | 'pocMaxConcurrentRuns'
        | 'pocRunsDir'
        | 'pocTemplatesRoot'
      >;

      const service = new PocService(config as AppConfigService);
      services.push(service);
      global.fetch = jest.fn().mockResolvedValue(successfulModelResponse());

      const result = await service.createGenerationRun({
        templateId,
      });

      const prompt = await readFile(join(config.pocRunsDir, result.runId, 'prompt.txt'), 'utf8');
      for (const file of templateConfig.editableFiles) {
        expect(prompt).toContain(`--- FILE: ${file} ---`);
      }
      expect(prompt).not.toContain('--- FILE: build.mjs ---');
      expect(prompt).not.toContain('--- FILE: package.json ---');
      expect(result.build.success).toBe(true);
    },
  );

  it('creates a feature-update run from a completed generation run', async () => {
    const { service, runsDir, templateDir, templateId } = await makeService();
    const fetchMock = jest.fn();
    fetchMock
      .mockResolvedValueOnce(
        successfulModelResponse({
          summary: 'Generate the base Breakout game',
          content:
            'document.body.innerHTML = "<main><h1>Breakout Ready</h1><p>Press Space to start.</p></main>";\n',
          inputTokens: 10,
          outputTokens: 20,
          totalTokens: 30,
        }),
      )
      .mockResolvedValueOnce(
        successfulModelResponse({
          summary: 'Add exploding blocks',
          content:
            'document.body.innerHTML = "<main><h1>Breakout Ready</h1><p>Press Space to start.</p><p>Exploding blocks are active. Hit a brick to trigger a blast.</p></main>";\n',
          inputTokens: 12,
          outputTokens: 22,
          totalTokens: 34,
        }),
      );
    global.fetch = fetchMock;

    const generation = await service.createGenerationRun({
      templateId,
    });

    await writeFile(
      join(templateDir, 'template.config.json'),
      `${JSON.stringify(
        {
          name: 'Changed Template On Disk',
          editableFiles: ['src/styles.css'],
          staticBuild: {
            outputDir: 'dist',
            entryHtml: 'dist/index.html',
          },
        },
        null,
        2,
      )}\n`,
      'utf8',
    );
    await writeFile(
      join(templateDir, 'src', 'main.js'),
      'document.body.innerHTML = "<main><h1>Template Changed On Disk</h1></main>";\n',
      'utf8',
    );

    const feature = await service.createFeatureRun({
      sourceRunId: generation.runId,
    });

    expect(feature.build.success).toBe(true);
    expect(feature.summary).toMatch(/exploding blocks/i);
    expect(feature.preview?.url).toMatch(/^http:\/\/127\.0\.0\.1:\d+\/$/);

    await expect(readFile(join(runsDir, feature.runId, 'prompt.txt'), 'utf8')).resolves.toContain(
      `SOURCE RUN ID: ${generation.runId}`,
    );
    await expect(readFile(join(runsDir, feature.runId, 'prompt.txt'), 'utf8')).resolves.toContain(
      'Breakout Ready',
    );
    await expect(readFile(join(runsDir, feature.runId, 'prompt.txt'), 'utf8')).resolves.toContain(
      'Feature: add exploding blocks that damage neighboring bricks when hit.',
    );
    await expect(
      readFile(join(runsDir, feature.runId, 'prompt.txt'), 'utf8'),
    ).resolves.not.toContain('Template Changed On Disk');
    await expect(
      readFile(join(runsDir, feature.runId, 'workspace', 'src', 'main.js'), 'utf8'),
    ).resolves.toContain('Exploding blocks are active');
  });

  it('creates a bug-fix run from a completed feature-update run', async () => {
    const { service, runsDir, templateDir, templateId } = await makeService();
    const { feature } = await createCompletedFeatureRun(service, templateId, [
      successfulModelResponse({
        summary: 'Generate the base Breakout game',
        content:
          'document.body.innerHTML = "<main><h1>Breakout Ready</h1><p>Press Space to start.</p></main>";\n',
        inputTokens: 10,
        outputTokens: 20,
        totalTokens: 30,
      }),
      successfulModelResponse({
        summary: 'Add exploding blocks',
        content:
          'document.body.innerHTML = "<main><h1>Breakout Ready</h1><p>Press Space to start.</p><p>Use the arrow keys to move.</p><p>Exploding blocks are active. Hit a brick to trigger a blast.</p></main>";\n',
        inputTokens: 12,
        outputTokens: 22,
        totalTokens: 34,
      }),
      successfulModelResponse({
        summary: 'Increase arrow-key paddle speed',
        content:
          'document.body.innerHTML = "<main><h1>Breakout Ready</h1><p>Press Space to start.</p><p>Arrow-key movement is now twice as fast.</p><p>Exploding blocks are active. Hit a brick to trigger a blast.</p></main>";\n',
        inputTokens: 14,
        outputTokens: 24,
        totalTokens: 38,
      }),
    ]);
    await writeFile(
      join(templateDir, 'src', 'main.js'),
      'document.body.innerHTML = "<main><h1>Template Changed On Disk</h1></main>";\n',
      'utf8',
    );
    const bugFix = await service.createBugFixRun({
      sourceRunId: feature.runId,
    });

    expect(bugFix.build.success).toBe(true);
    expect(bugFix.summary).toMatch(/arrow-key.*speed|increase.*speed/i);
    expect(bugFix.preview?.url).toMatch(/^http:\/\/127\.0\.0\.1:\d+\/$/);

    await expect(readFile(join(runsDir, bugFix.runId, 'prompt.txt'), 'utf8')).resolves.toContain(
      `SOURCE RUN ID: ${feature.runId}`,
    );
    await expect(readFile(join(runsDir, bugFix.runId, 'prompt.txt'), 'utf8')).resolves.toContain(
      'Bug: moving the paddle with the left and right arrow keys is too slow.',
    );
    await expect(readFile(join(runsDir, bugFix.runId, 'prompt.txt'), 'utf8')).resolves.toContain(
      '- make left/right arrow movement exactly twice as fast as it is now',
    );
    await expect(
      readFile(join(runsDir, bugFix.runId, 'prompt.txt'), 'utf8'),
    ).resolves.not.toContain('Template Changed On Disk');
    await expect(
      readFile(join(runsDir, bugFix.runId, 'workspace', 'src', 'main.js'), 'utf8'),
    ).resolves.toContain('twice as fast');
  });

  it('rejects feature runs for an unknown source run', async () => {
    const { service, runsDir } = await makeService();
    await mkdir(runsDir, { recursive: true });

    await expect(
      service.createFeatureRun({
        sourceRunId: '2026-04-18T22-06-01.400Z--deadbeef',
      }),
    ).rejects.toThrow(/Unknown source run/);
  });

  it('rejects feature runs when the source run is not completed', async () => {
    const { service, runsDir } = await makeService();
    const sourceRunId = '2026-04-18T22-06-01.400Z--feedcafe';
    const runDir = join(runsDir, sourceRunId);

    await mkdir(join(runDir, 'workspace'), { recursive: true });
    await writeFile(
      join(runDir, 'status.json'),
      `${JSON.stringify({ status: 'failed' }, null, 2)}\n`,
      'utf8',
    );
    await writeFile(
      join(runDir, 'run-metadata.json'),
      `${JSON.stringify(
        {
          runKind: 'generation',
          templateId: 'breakout-basic',
          templateConfig: {
            name: 'Arcade Canvas Starter',
            editableFiles: ['src/index.html', 'src/main.js', 'src/styles.css'],
            staticBuild: {
              outputDir: 'dist',
              entryHtml: 'dist/index.html',
            },
          },
        },
        null,
        2,
      )}\n`,
      'utf8',
    );

    await expect(
      service.createFeatureRun({
        sourceRunId,
      }),
    ).rejects.toThrow(/not in a completed state/);
  });

  it('rejects feature runs when the source run workspace is missing', async () => {
    const { service, runsDir } = await makeService();
    const sourceRunId = '2026-04-18T22-06-01.400Z--abcddcba';
    const runDir = join(runsDir, sourceRunId);

    await mkdir(runDir, { recursive: true });
    await writeFile(
      join(runDir, 'status.json'),
      `${JSON.stringify({ status: 'completed' }, null, 2)}\n`,
      'utf8',
    );
    await writeFile(
      join(runDir, 'run-metadata.json'),
      `${JSON.stringify(
        {
          runKind: 'generation',
          templateId: 'breakout-basic',
          templateConfig: {
            name: 'Arcade Canvas Starter',
            editableFiles: ['src/index.html', 'src/main.js', 'src/styles.css'],
            staticBuild: {
              outputDir: 'dist',
              entryHtml: 'dist/index.html',
            },
          },
        },
        null,
        2,
      )}\n`,
      'utf8',
    );

    await expect(
      service.createFeatureRun({
        sourceRunId,
      }),
    ).rejects.toThrow(/Unknown source run/);
  });

  it('rejects feature runs when the saved template snapshot is invalid', async () => {
    const { service, runsDir } = await makeService();
    const sourceRunId = '2026-04-18T22-06-01.400Z--c0ffee00';
    const runDir = join(runsDir, sourceRunId);

    await mkdir(join(runDir, 'workspace'), { recursive: true });
    await writeFile(
      join(runDir, 'status.json'),
      `${JSON.stringify({ status: 'completed' }, null, 2)}\n`,
      'utf8',
    );
    await writeFile(
      join(runDir, 'run-metadata.json'),
      `${JSON.stringify(
        {
          runKind: 'generation',
          templateId: 'breakout-basic',
          templateConfig: {
            name: 'Broken Snapshot',
            editableFiles: [],
            staticBuild: {
              outputDir: 'dist',
            },
          },
        },
        null,
        2,
      )}\n`,
      'utf8',
    );

    await expect(
      service.createFeatureRun({
        sourceRunId,
      }),
    ).rejects.toThrow(/template snapshot is invalid/);
  });

  it('rejects bug-fix runs when the source run is not a feature-update', async () => {
    const { service, templateId } = await makeService();
    global.fetch = jest.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          model: 'gpt-5.2',
          output: [
            {
              content: [
                {
                  type: 'output_text',
                  text: JSON.stringify({
                    summary: 'Generate a simple Breakout game',
                    files: [
                      {
                        path: 'src/main.js',
                        content:
                          'document.body.innerHTML = "<main><h1>Breakout Ready</h1><p>Press Space to start.</p></main>";\n',
                      },
                    ],
                  }),
                },
              ],
            },
          ],
          usage: {
            prompt_tokens: 10,
            completion_tokens: 20,
            total_tokens: 30,
          },
        }),
        { status: 200 },
      ),
    );

    const generation = await service.createGenerationRun({
      templateId,
    });

    await expect(
      service.createBugFixRun({
        sourceRunId: generation.runId,
      }),
    ).rejects.toThrow(/must start from a completed feature-update run/);
  });

  async function makeService(options?: {
    buildFileContent?: string;
    buildScript?: string;
    rootParent?: string;
  }): Promise<{
    runsDir: string;
    service: PocService;
    templateDir: string;
    templateId: string;
  }> {
    const rootParent = options?.rootParent ?? join(repoRoot, '.gamevine');
    await mkdir(rootParent, { recursive: true });
    const root = await mkdtemp(join(rootParent, 'gamevine-poc-'));
    tempRoots.push(root);

    const templatesRoot = join(root, 'templates');
    const runsDir = join(root, 'runs');
    const templateId = 'breakout-basic';
    const templateDir = join(templatesRoot, templateId);

    await mkdir(join(templateDir, 'src'), { recursive: true });
    await writeFile(
      join(templateDir, 'template.config.json'),
      `${JSON.stringify(
        {
          name: 'Arcade Canvas Starter',
          editableFiles: ['src/index.html', 'src/main.js', 'src/styles.css'],
          staticBuild: {
            outputDir: 'dist',
            entryHtml: 'dist/index.html',
          },
        },
        null,
        2,
      )}\n`,
      'utf8',
    );
    await writeFile(
      join(templateDir, 'package.json'),
      `${JSON.stringify(
        {
          name: 'poc-template',
          private: true,
          type: 'module',
          scripts: {
            build: options?.buildScript ?? 'node build.mjs',
          },
        },
        null,
        2,
      )}\n`,
      'utf8',
    );
    await writeFile(
      join(templateDir, 'build.mjs'),
      options?.buildFileContent ??
        [
          "import { cp, mkdir, rm } from 'node:fs/promises';",
          '',
          "await rm(new URL('./dist/', import.meta.url), { force: true, recursive: true });",
          "await mkdir(new URL('./dist/', import.meta.url), { recursive: true });",
          "await cp(new URL('./src/', import.meta.url), new URL('./dist/', import.meta.url), { recursive: true });",
          "console.log('build complete');",
          '',
        ].join('\n'),
      'utf8',
    );
    await writeFile(
      join(templateDir, 'src', 'index.html'),
      '<!doctype html><html><head><title>Gamevine Arcade Template</title></head><body><script type="module" src="./main.js"></script></body></html>\n',
      'utf8',
    );
    await writeFile(
      join(templateDir, 'src', 'main.js'),
      'document.body.insertAdjacentHTML("beforeend", "<main><h1>Template Starter</h1></main>");\n',
      'utf8',
    );
    await writeFile(
      join(templateDir, 'src', 'styles.css'),
      'body { background: #020617; }\n',
      'utf8',
    );

    const config = {
      isProduction: false,
      aiApiKey: 'test-key',
      aiBaseUrl: 'https://openrouter.ai/api/v1',
      aiModel: 'gpt-5.2',
      pocApiEnabled: true,
      pocMaxConcurrentRuns: 1,
      pocRunsDir: runsDir,
      pocTemplatesRoot: templatesRoot,
    } satisfies Pick<
      AppConfigService,
      | 'isProduction'
      | 'aiApiKey'
      | 'aiBaseUrl'
      | 'aiModel'
      | 'pocApiEnabled'
      | 'pocMaxConcurrentRuns'
      | 'pocRunsDir'
      | 'pocTemplatesRoot'
    >;

    const service = new PocService(config as AppConfigService);
    services.push(service);

    return {
      runsDir,
      service,
      templateDir,
      templateId,
    };
  }

  async function readLatestStatus(runsDir: string): Promise<Record<string, unknown>> {
    const [runId] = await readdir(runsDir);
    return JSON.parse(await readFile(join(runsDir, runId, 'status.json'), 'utf8')) as Record<
      string,
      unknown
    >;
  }

  async function createCompletedFeatureRun(
    service: PocService,
    templateId: string,
    responses: Response[],
  ): Promise<{ feature: GenerationRunResponse; generation: GenerationRunResponse }> {
    const fetchMock = jest.fn();
    for (const response of responses) {
      fetchMock.mockResolvedValueOnce(response);
    }
    global.fetch = fetchMock;

    const generation = await service.createGenerationRun({ templateId });
    const feature = await service.createFeatureRun({
      sourceRunId: generation.runId,
    });

    return { feature, generation };
  }
});

function successfulModelResponse(input?: {
  content?: string;
  inputTokens?: number;
  outputTokens?: number;
  summary?: string;
  totalTokens?: number;
}): Response {
  return new Response(
    JSON.stringify({
      model: 'gpt-5.2',
      output: [
        {
          content: [
            {
              type: 'output_text',
              text: JSON.stringify({
                summary: input?.summary ?? 'Generate a simple Breakout game',
                files: [
                  {
                    path: 'src/main.js',
                    content:
                      input?.content ??
                      'document.body.innerHTML = "<main><h1>Breakout Ready</h1><p>Press Space to start.</p></main>";\n',
                  },
                ],
              }),
            },
          ],
        },
      ],
      usage: {
        prompt_tokens: input?.inputTokens ?? 10,
        completion_tokens: input?.outputTokens ?? 20,
        total_tokens: input?.totalTokens ?? 30,
      },
    }),
    { status: 200 },
  );
}

async function fetchResponse(url: string): Promise<{
  body: string;
  headers: Record<string, string>;
  statusCode: number;
}> {
  return new Promise((resolvePromise, reject) => {
    const request = httpRequest(url, (response) => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => {
        body += chunk;
      });
      response.on('end', () => {
        resolvePromise({
          body,
          headers: Object.fromEntries(
            Object.entries(response.headers).map(([key, value]) => [
              key,
              Array.isArray(value) ? value.join(', ') : (value ?? ''),
            ]),
          ),
          statusCode: response.statusCode ?? 0,
        });
      });
    });

    request.on('error', reject);
    request.end();
  });
}
