import { randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import { cp, lstat, mkdir, readFile, readdir, realpath, stat, writeFile } from 'node:fs/promises';
import { basename, delimiter, dirname, extname, join, resolve } from 'node:path';
import {
  BadGatewayException,
  BadRequestException,
  GatewayTimeoutException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleDestroy,
  ServiceUnavailableException,
} from '@nestjs/common';
import { AppConfigService } from '../config/app-config.service';
import {
  type CreateBugFixRunRequest,
  type CreateFeatureRunRequest,
  type CreateGenerationRunRequest,
  type GenerationRunResponse,
  ModelGenerationResultSchema,
  type ModelFileWrite,
  TemplateConfigSchema,
  type TemplateConfig,
} from './poc.dto';

type AiUsage = {
  input_tokens?: number;
  output_tokens?: number;
  total_tokens?: number;
  prompt_tokens?: number;
  completion_tokens?: number;
};

type AiOutputContent = {
  type?: string;
  text?: string;
};

type AiOutputMessage = {
  type?: string;
  content?: AiOutputContent[];
};

type AiResponse = {
  model?: string;
  status?: string;
  error?: unknown;
  incomplete_details?: unknown;
  output?: AiOutputMessage[];
  usage?: AiUsage;
};

type BuildResult = {
  stdout: string;
  stderr: string;
  exitCode: number;
  durationMs: number;
  timedOut: boolean;
};

type PreviewHandle = {
  createdAt: number;
  port: number;
  rootDir: string;
  server: Server;
};

type ResolvedTemplate = {
  config: TemplateConfig;
  id: string;
  realPath: string;
};

type StaticBuildInfo = {
  entryHtml: string;
  outputDir: string;
};

const COPY_EXCLUDES = new Set(['.git', '.next', '.turbo', 'coverage', 'dist', 'node_modules']);

const DEFAULT_BUILD_COMMAND = ['pnpm', 'build'] as const;
const MODEL_REQUEST_TIMEOUT_MS = 120_000;
const BUILD_TIMEOUT_MS = 180_000;
const MAX_PREVIEW_SERVERS = 3;
const PREVIEW_HOST = '127.0.0.1';

const FIXED_GENERATION_TARGET = [
  'Create a small arcade-style browser game: Breakout.',
  'Keep it fully client-side and static; do not add servers or external APIs.',
  'Use the existing template structure and only modify the approved editable files.',
  'The result should include:',
  '- paddle movement with keyboard controls',
  '- ball physics and wall collisions',
  '- a brick field that can be cleared',
  '- score tracking',
  '- lives or a fail state',
  '- win/lose messaging',
  '- a restart flow',
  'Keep the code simple, readable, and easy to patch in later runs.',
].join('\n');

const FIXED_FEATURE_UPDATE = [
  'Apply one small feature update to the existing Breakout game.',
  'Feature: add pause/resume support when the player presses the "P" key.',
  'Requirements:',
  '- show a clear paused overlay or label',
  '- freeze gameplay while paused',
  '- keep the rest of the game behavior intact',
  '- add a short on-screen hint that teaches the control',
  'Do not add dependencies or modify files outside the approved editable set.',
].join('\n');

const FIXED_BUG_FIX = [
  'Fix one specific bug in the existing Breakout game.',
  'Bug: moving the paddle with the left and right arrow keys is too slow.',
  'Requirements:',
  '- make left/right arrow movement exactly twice as fast as it is now',
  '- keep the same arrow-key controls',
  '- preserve the rest of the gameplay behavior',
  '- do not redesign unrelated mechanics or UI',
  'Do not add dependencies or modify files outside the approved editable set.',
].join('\n');

const MIME_TYPES: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.wav': 'audio/wav',
  '.webm': 'video/webm',
};

@Injectable()
export class PocService implements OnModuleDestroy {
  private readonly logger = new Logger(PocService.name);
  private readonly previewServers = new Map<string, PreviewHandle>();
  private activeRuns = 0;

  constructor(private readonly config: AppConfigService) {}

  async onModuleDestroy(): Promise<void> {
    await Promise.all(
      [...this.previewServers.values()].map((preview) => closeServer(preview.server)),
    );
    this.previewServers.clear();
  }

  async createGenerationRun(input: CreateGenerationRunRequest): Promise<GenerationRunResponse> {
    this.assertPocApiEnabled();

    const template = await this.resolveTemplate(input.templateId);
    const model = this.resolveModel(input.model);

    return this.withRunSlot(async () => {
      const promptText = buildGenerationPrompt({
        files: await this.readConfiguredTemplateFiles(
          template.realPath,
          template.config.editableFiles,
        ),
        template,
      });

      return this.executeRun({
        model,
        promptText,
        runKind: 'generation',
        sourceDir: template.realPath,
        template,
      });
    });
  }

  async createFeatureRun(input: CreateFeatureRunRequest): Promise<GenerationRunResponse> {
    this.assertPocApiEnabled();

    const previousRun = await this.resolveExistingRun(input.sourceRunId);
    const model = this.resolveModel(input.model);

    return this.withRunSlot(async () => {
      const promptText = await this.buildSourceRunPrompt(
        previousRun,
        input.sourceRunId,
        FIXED_FEATURE_UPDATE,
      );

      return this.executeRun({
        model,
        promptText,
        runKind: 'feature-update',
        sourceDir: previousRun.workspaceDir,
        sourceRunId: input.sourceRunId,
        template: previousRun.template,
      });
    });
  }

  async createBugFixRun(input: CreateBugFixRunRequest): Promise<GenerationRunResponse> {
    this.assertPocApiEnabled();

    const previousRun = await this.resolveExistingRun(input.sourceRunId);
    if (previousRun.runKind !== 'feature-update') {
      throw new BadRequestException(
        `Bug-fix runs must start from a completed feature-update run: ${input.sourceRunId}`,
      );
    }

    const model = this.resolveModel(input.model);

    return this.withRunSlot(async () => {
      const promptText = await this.buildSourceRunPrompt(
        previousRun,
        input.sourceRunId,
        FIXED_BUG_FIX,
      );

      return this.executeRun({
        model,
        promptText,
        runKind: 'bug-fix',
        sourceDir: previousRun.workspaceDir,
        sourceRunId: input.sourceRunId,
        template: previousRun.template,
      });
    });
  }

  private assertPocApiEnabled(): void {
    if (!this.config.pocApiEnabled || this.config.isProduction) {
      throw new NotFoundException('POC generation endpoint is disabled');
    }
  }

  private resolveModel(model: string | undefined): string {
    const resolvedModel = model ?? this.config.aiModel;
    if (!resolvedModel) {
      throw new ServiceUnavailableException('No model was provided and AI_MODEL is not configured');
    }

    return resolvedModel;
  }

  private async withRunSlot<T>(work: () => Promise<T>): Promise<T> {
    if (this.activeRuns >= this.config.pocMaxConcurrentRuns) {
      throw new ServiceUnavailableException(
        `POC concurrency limit reached (${String(this.config.pocMaxConcurrentRuns)} active runs)`,
      );
    }

    this.activeRuns += 1;
    try {
      return await work();
    } finally {
      this.activeRuns -= 1;
    }
  }

  private async executeRun(input: {
    model: string;
    promptText: string;
    runKind: 'bug-fix' | 'feature-update' | 'generation';
    sourceDir: string;
    sourceRunId?: string;
    template: ResolvedTemplate;
  }): Promise<GenerationRunResponse> {
    const apiKey = this.config.aiApiKey;
    if (!apiKey) {
      throw new ServiceUnavailableException(
        'AI_API_KEY is not configured for the POC generation endpoint',
      );
    }

    const runId = createRunId();
    const artifactsDir = resolve(process.cwd(), this.config.pocRunsDir, runId);
    const workspaceDir = join(artifactsDir, 'workspace');
    const staticBuild = {
      entryHtml: input.template.config.staticBuild.entryHtml,
      outputDir: input.template.config.staticBuild.outputDir,
    } satisfies StaticBuildInfo;

    await mkdir(artifactsDir, { recursive: true });
    let phase = 'setup';

    try {
      await writeStatus(artifactsDir, {
        ...runningStatus(phase, runId, input.template.id),
        runKind: input.runKind,
        sourceRunId: input.sourceRunId ?? null,
      });

      await writeJson(join(artifactsDir, 'run-metadata.json'), {
        runId,
        runKind: input.runKind,
        sourceRunId: input.sourceRunId ?? null,
        staticBuild,
        templateConfig: input.template.config,
        templateId: input.template.id,
      });

      await assertTemplateHasNoSymlinks(input.sourceDir);
      await cp(input.sourceDir, workspaceDir, {
        recursive: true,
        dereference: false,
        filter: (source) => !COPY_EXCLUDES.has(basename(source)),
      });

      const requestPayload = {
        model: input.model,
        instructions: buildModelInstructions(),
        input: input.promptText,
        text: {
          format: {
            type: 'json_object',
          },
        },
      };

      await writeJson(join(artifactsDir, 'request.json'), requestPayload);
      await writeFile(join(artifactsDir, 'prompt.txt'), input.promptText, 'utf8');

      phase = 'model';
      await writeStatus(artifactsDir, {
        ...runningStatus(phase, runId, input.template.id),
        runKind: input.runKind,
        sourceRunId: input.sourceRunId ?? null,
      });

      const requestStartedAt = Date.now();
      const aiResponse = await this.requestModel(requestPayload, apiKey);
      const requestDurationMs = Date.now() - requestStartedAt;

      await writeJson(join(artifactsDir, 'response.json'), aiResponse);

      const outputText = extractOutputText(aiResponse);
      if (!outputText) {
        throw new BadGatewayException('The model response did not include any output text');
      }

      await writeFile(join(artifactsDir, 'response.txt'), outputText, 'utf8');

      phase = 'parse';
      const parsed = parseModelResponse(outputText);
      assertAllowedOutputPaths(parsed.files, input.template.config.editableFiles);

      await writeJson(join(artifactsDir, 'planned-changes.json'), parsed);
      await this.applyModelWrites(workspaceDir, parsed.files);

      phase = 'usage';
      const usage = normalizeUsage(aiResponse.usage);
      if (!usage) {
        throw new BadGatewayException('The model response did not include token usage');
      }

      phase = 'install';
      await writeStatus(artifactsDir, {
        ...runningStatus(phase, runId, input.template.id),
        runKind: input.runKind,
        sourceRunId: input.sourceRunId ?? null,
      });

      const installCommand = await determineInstallCommand(workspaceDir);
      if (installCommand) {
        const install = await runCommand(workspaceDir, installCommand, BUILD_TIMEOUT_MS);
        await writeFile(
          join(artifactsDir, 'install.log'),
          [`$ ${installCommand.join(' ')}`, '', install.stdout, install.stderr]
            .filter(Boolean)
            .join('\n'),
          'utf8',
        );
        await writeJson(join(artifactsDir, 'install-result.json'), install);

        if (install.exitCode !== 0 || install.timedOut) {
          throw new BadGatewayException('Template dependency bootstrap failed');
        }
      } else {
        await writeFile(
          join(artifactsDir, 'install.log'),
          'Skipped install: no dependencies declared.\n',
          'utf8',
        );
        await writeJson(join(artifactsDir, 'install-result.json'), {
          skipped: true,
        });
      }

      phase = 'build';
      await writeStatus(artifactsDir, {
        ...runningStatus(phase, runId, input.template.id),
        runKind: input.runKind,
        sourceRunId: input.sourceRunId ?? null,
      });

      const buildCommand = await determineBuildCommand(workspaceDir);
      const build = await runCommand(workspaceDir, buildCommand, BUILD_TIMEOUT_MS);
      await writeFile(
        join(artifactsDir, 'build.log'),
        [`$ ${buildCommand.join(' ')}`, '', build.stdout, build.stderr].filter(Boolean).join('\n'),
        'utf8',
      );
      await writeJson(join(artifactsDir, 'build-result.json'), build);

      const runSucceeded = build.exitCode === 0 && !build.timedOut;
      let preview: { port: number; url: string } | null = null;

      if (runSucceeded) {
        phase = 'static-build';
        await assertStaticBuildExists(workspaceDir, staticBuild);
        await writeJson(join(artifactsDir, 'static-build.json'), staticBuild);

        phase = 'preview';
        preview = await this.startPreview(runId, join(workspaceDir, staticBuild.outputDir));
      }

      await writeStatus(artifactsDir, {
        phase: 'done',
        status: runSucceeded ? 'completed' : 'failed',
        preview,
        runId,
        runKind: input.runKind,
        sourceRunId: input.sourceRunId ?? null,
        staticBuild,
        templateId: input.template.id,
        build: {
          exitCode: build.exitCode,
          timedOut: build.timedOut,
        },
      });

      this.logger.log(
        `Completed ${input.runKind} run ${runId} (build=${runSucceeded ? 'ok' : 'failed'})`,
      );

      return {
        runId,
        templateId: input.template.id,
        model: input.model,
        changedFiles: parsed.files.map((file) => file.path),
        preview,
        staticBuild,
        summary: parsed.summary,
        usage,
        requestDurationMs,
        build: {
          success: runSucceeded,
          command: buildCommand,
          exitCode: build.exitCode,
          durationMs: build.durationMs,
          timedOut: build.timedOut,
          logFile: 'build.log',
        },
      };
    } catch (error) {
      await writeFailureArtifacts(artifactsDir, phase, error, {
        runId,
        runKind: input.runKind,
        sourceRunId: input.sourceRunId ?? null,
        staticBuild,
        templateId: input.template.id,
      });
      throw error;
    }
  }

  private async resolveTemplate(templateId: string): Promise<ResolvedTemplate> {
    const templatesRoot = resolve(process.cwd(), this.config.pocTemplatesRoot);
    const realTemplatesRoot = await realpath(templatesRoot).catch(() => null);

    if (!realTemplatesRoot) {
      throw new BadRequestException(
        `POC templates root does not exist: ${this.config.pocTemplatesRoot}`,
      );
    }

    const templatePath = resolve(realTemplatesRoot, templateId);
    const templateStat = await stat(templatePath).catch(() => null);
    if (!templateStat?.isDirectory()) {
      throw new BadRequestException(`Unknown template ID: ${templateId}`);
    }

    const realTemplatePath = await realpath(templatePath);
    assertRealPathWithinRoot(realTemplatesRoot, realTemplatePath, templateId);

    return {
      config: await this.readTemplateConfig(realTemplatePath),
      id: templateId,
      realPath: realTemplatePath,
    };
  }

  private async readTemplateConfig(templateDir: string): Promise<TemplateConfig> {
    const configPath = join(templateDir, 'template.config.json');
    const rawConfig = await readFile(configPath, 'utf8').catch(() => null);
    if (!rawConfig) {
      throw new BadRequestException(
        `Template is missing template.config.json: ${basename(templateDir)}`,
      );
    }

    let parsedConfig: unknown;
    try {
      parsedConfig = JSON.parse(rawConfig);
    } catch (error) {
      throw new BadRequestException(
        `Template config is not valid JSON: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    const result = TemplateConfigSchema.safeParse(parsedConfig);
    if (!result.success) {
      throw new BadRequestException(result.error.issues);
    }

    return result.data;
  }

  private async resolveExistingRun(sourceRunId: string): Promise<{
    runKind: 'bug-fix' | 'feature-update' | 'generation';
    template: ResolvedTemplate;
    workspaceDir: string;
  }> {
    const runsRoot = resolve(process.cwd(), this.config.pocRunsDir);
    const realRunsRoot = await realpath(runsRoot).catch(() => null);
    if (!realRunsRoot) {
      throw new NotFoundException('POC runs directory does not exist');
    }

    const artifactsDir = resolve(realRunsRoot, sourceRunId);
    const realArtifactsDir = await realpath(artifactsDir).catch(() => null);
    if (!realArtifactsDir) {
      throw new NotFoundException(`Unknown source run: ${sourceRunId}`);
    }

    assertRealPathWithinRoot(realRunsRoot, realArtifactsDir, sourceRunId);

    const statusPath = join(artifactsDir, 'status.json');
    const metadataPath = join(artifactsDir, 'run-metadata.json');
    const workspaceDir = join(artifactsDir, 'workspace');

    const [rawStatus, rawMetadata, workspaceStat] = await Promise.all([
      readFile(statusPath, 'utf8').catch(() => null),
      readFile(metadataPath, 'utf8').catch(() => null),
      stat(workspaceDir).catch(() => null),
    ]);

    if (!rawStatus || !rawMetadata || !workspaceStat?.isDirectory()) {
      throw new NotFoundException(`Unknown source run: ${sourceRunId}`);
    }

    const statusRecord = asRecord(parseJsonOrRaw(rawStatus));
    const metadataRecord = asRecord(parseJsonOrRaw(rawMetadata));

    if (statusRecord?.status !== 'completed') {
      throw new BadRequestException(`Source run is not in a completed state: ${sourceRunId}`);
    }

    if (typeof metadataRecord?.templateId !== 'string') {
      throw new BadRequestException(`Source run metadata is invalid: ${sourceRunId}`);
    }

    if (
      metadataRecord.runKind !== 'bug-fix' &&
      metadataRecord.runKind !== 'feature-update' &&
      metadataRecord.runKind !== 'generation'
    ) {
      throw new BadRequestException(`Source run kind is invalid: ${sourceRunId}`);
    }

    const templateConfigResult = TemplateConfigSchema.safeParse(metadataRecord.templateConfig);
    if (!templateConfigResult.success) {
      throw new BadRequestException(`Source run template snapshot is invalid: ${sourceRunId}`);
    }

    return {
      runKind: metadataRecord.runKind,
      template: {
        config: templateConfigResult.data,
        id: metadataRecord.templateId,
        realPath: workspaceDir,
      },
      workspaceDir,
    };
  }

  private async readConfiguredTemplateFiles(
    templateDir: string,
    files: string[],
  ): Promise<Array<{ path: string; content: string }>> {
    const results: Array<{ path: string; content: string }> = [];
    const realTemplateDir = await realpath(templateDir);

    for (const relativePath of files) {
      const absolutePath = resolve(templateDir, relativePath);
      const fileStat = await lstat(absolutePath).catch(() => null);
      if (!fileStat?.isFile()) {
        throw new BadRequestException(`Template file does not exist: ${relativePath}`);
      }

      if (fileStat.isSymbolicLink()) {
        throw new BadRequestException(`Symlinked template files are not allowed: ${relativePath}`);
      }

      const realFilePath = await realpath(absolutePath);
      assertRealPathWithinRoot(realTemplateDir, realFilePath, relativePath);

      results.push({
        path: relativePath,
        content: await readFile(realFilePath, 'utf8'),
      });
    }

    return results;
  }

  private async buildSourceRunPrompt(
    previousRun: { template: ResolvedTemplate; workspaceDir: string },
    sourceRunId: string,
    taskInstructions: string,
  ): Promise<string> {
    return buildSourceRunPrompt({
      files: await this.readConfiguredTemplateFiles(
        previousRun.workspaceDir,
        previousRun.template.config.editableFiles,
      ),
      sourceRunId,
      taskInstructions,
      template: previousRun.template,
    });
  }

  private async startPreview(
    runId: string,
    rootDir: string,
  ): Promise<{ port: number; url: string }> {
    const existing = this.previewServers.get(runId);
    if (existing && existing.rootDir === rootDir) {
      return {
        port: existing.port,
        url: `http://${PREVIEW_HOST}:${String(existing.port)}/`,
      };
    }

    if (existing) {
      await closeServer(existing.server);
      this.previewServers.delete(runId);
    }

    const server = createServer((request, response) => {
      void this.handlePreviewRequest(rootDir, request, response);
    });

    return new Promise((resolvePromise, reject) => {
      server.once('error', reject);
      server.listen(0, PREVIEW_HOST, () => {
        server.removeListener('error', reject);
        const address = server.address();
        if (!address || typeof address === 'string') {
          reject(new BadGatewayException('Preview server failed to bind to a local port'));
          return;
        }

        this.previewServers.set(runId, {
          createdAt: Date.now(),
          port: address.port,
          rootDir,
          server,
        });
        void this.prunePreviewServers();
        resolvePromise({
          port: address.port,
          url: `http://${PREVIEW_HOST}:${String(address.port)}/`,
        });
      });
    });
  }

  private async handlePreviewRequest(
    rootDir: string,
    request: IncomingMessage,
    response: ServerResponse,
  ): Promise<void> {
    try {
      const requestUrl = new URL(request.url ?? '/', 'http://localhost');
      const requestedPath =
        requestUrl.pathname === '/' ? 'index.html' : requestUrl.pathname.replace(/^\/+/, '');
      let filePath = resolve(rootDir, requestedPath);
      assertRealPathWithinRoot(rootDir, filePath, requestedPath);

      let fileStat = await stat(filePath).catch(() => null);
      if (fileStat?.isDirectory()) {
        filePath = join(filePath, 'index.html');
        fileStat = await stat(filePath).catch(() => null);
      }

      if (!fileStat?.isFile() && extname(requestedPath) === '') {
        filePath = resolve(rootDir, 'index.html');
        fileStat = await stat(filePath).catch(() => null);
      }

      if (!fileStat?.isFile()) {
        response.statusCode = 404;
        response.end('Not found');
        return;
      }

      response.statusCode = 200;
      response.setHeader('Cache-Control', 'no-store');
      response.setHeader('Content-Type', getMimeType(filePath));
      response.end(await readFile(filePath));
    } catch (error) {
      if (error instanceof BadRequestException) {
        response.statusCode = 404;
        response.end('Not found');
        return;
      }

      response.statusCode = 500;
      response.end('Preview error');
    }
  }

  private async requestModel(
    payload: Record<string, unknown>,
    apiKey: string,
  ): Promise<AiResponse> {
    let response: Response;
    try {
      response = await fetch(`${this.config.aiBaseUrl}/responses`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(MODEL_REQUEST_TIMEOUT_MS),
      });
    } catch (error) {
      if (isAbortError(error)) {
        throw new GatewayTimeoutException('The model request timed out');
      }

      throw new BadGatewayException(
        `AI provider request failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    const responseText = await response.text();
    const parsedBody = parseJsonOrRaw(responseText);

    if (!response.ok) {
      throw new BadGatewayException(
        `AI provider request failed with ${response.status}: ${truncateForError(responseText)}`,
      );
    }

    if (!parsedBody || typeof parsedBody !== 'object') {
      throw new BadGatewayException('AI provider response was not valid JSON');
    }

    const aiResponse = parsedBody as AiResponse;
    if (aiResponse.status && aiResponse.status !== 'completed') {
      throw new BadGatewayException(
        `AI provider response did not complete successfully: ${JSON.stringify({
          status: aiResponse.status,
          error: aiResponse.error ?? null,
          incomplete_details: aiResponse.incomplete_details ?? null,
        })}`,
      );
    }

    return aiResponse;
  }

  private async applyModelWrites(workspaceDir: string, files: ModelFileWrite[]): Promise<void> {
    for (const file of files) {
      const absolutePath = resolve(workspaceDir, file.path);
      assertRealPathWithinRoot(workspaceDir, dirname(absolutePath), file.path);

      await mkdir(dirname(absolutePath), { recursive: true });
      await writeFile(absolutePath, file.content, 'utf8');
    }
  }

  private async prunePreviewServers(): Promise<void> {
    if (this.previewServers.size <= MAX_PREVIEW_SERVERS) {
      return;
    }

    const previews = [...this.previewServers.entries()].sort(
      (left, right) => left[1].createdAt - right[1].createdAt,
    );

    while (previews.length > MAX_PREVIEW_SERVERS) {
      const oldest = previews.shift();
      if (!oldest) {
        return;
      }

      this.previewServers.delete(oldest[0]);
      await closeServer(oldest[1].server);
    }
  }
}

function createRunId(): string {
  return `${new Date().toISOString().replaceAll(':', '-')}--${randomUUID().slice(0, 8)}`;
}

function buildModelInstructions(): string {
  return [
    'You are editing a browser game template for a small POC run.',
    'Return only valid JSON.',
    'Do not wrap the JSON in markdown fences.',
    'The JSON must match this exact shape:',
    '{',
    '  "summary": "short description of the change",',
    '  "files": [',
    '    {',
    '      "path": "relative/path/to/file",',
    '      "content": "full replacement file contents"',
    '    }',
    '  ]',
    '}',
    'Only modify files that appear in the provided TEMPLATE FILES or CURRENT FILES section.',
    'Every file entry must contain the full replacement contents for that file.',
  ].join('\n');
}

function buildGenerationPrompt(input: {
  files: Array<{ path: string; content: string }>;
  template: ResolvedTemplate;
}): string {
  const renderedFiles = input.files
    .map((file) =>
      [`--- FILE: ${file.path} ---`, file.content.trimEnd(), `--- END FILE: ${file.path} ---`].join(
        '\n',
      ),
    )
    .join('\n\n');

  return [
    'TASK',
    FIXED_GENERATION_TARGET,
    '',
    `TEMPLATE NAME: ${input.template.config.name}`,
    `TEMPLATE ID: ${input.template.id}`,
    '',
    'TEMPLATE FILES',
    renderedFiles,
  ].join('\n');
}

function buildSourceRunPrompt(input: {
  files: Array<{ path: string; content: string }>;
  sourceRunId: string;
  taskInstructions: string;
  template: ResolvedTemplate;
}): string {
  const renderedFiles = input.files
    .map((file) =>
      [`--- FILE: ${file.path} ---`, file.content.trimEnd(), `--- END FILE: ${file.path} ---`].join(
        '\n',
      ),
    )
    .join('\n\n');

  return [
    'TASK',
    input.taskInstructions,
    '',
    `TEMPLATE NAME: ${input.template.config.name}`,
    `TEMPLATE ID: ${input.template.id}`,
    `SOURCE RUN ID: ${input.sourceRunId}`,
    '',
    'CURRENT FILES',
    renderedFiles,
  ].join('\n');
}

export function extractOutputText(response: AiResponse): string {
  return (
    response.output
      ?.flatMap((item) => item.content ?? [])
      .filter((item) => item.type === 'output_text' && typeof item.text === 'string')
      .map((item) => item.text ?? '')
      .join('\n')
      .trim() ?? ''
  );
}

export function parseModelResponse(raw: string): {
  summary: string;
  files: ModelFileWrite[];
} {
  const cleaned = stripMarkdownFences(raw);
  let parsed: unknown;

  try {
    parsed = JSON.parse(cleaned);
  } catch (error) {
    throw new BadGatewayException(
      `The model did not return valid JSON: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  const result = ModelGenerationResultSchema.safeParse(parsed);
  if (!result.success) {
    throw new BadGatewayException(result.error.issues);
  }

  return result.data;
}

export function assertAllowedOutputPaths(files: ModelFileWrite[], allowedFiles: string[]): void {
  const allowed = new Set(allowedFiles);

  for (const file of files) {
    if (!allowed.has(file.path)) {
      throw new BadGatewayException(
        `Model attempted to modify a file outside the allowed set: ${file.path}`,
      );
    }
  }
}

export function stripMarkdownFences(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed.startsWith('```')) {
    return trimmed;
  }

  const withoutOpening = trimmed.replace(/^```[a-zA-Z0-9_-]*\n/, '');
  return withoutOpening.replace(/\n```$/, '').trim();
}

function normalizeUsage(usage: AiUsage | undefined):
  | {
      inputTokens: number;
      outputTokens: number;
      totalTokens: number;
    }
  | undefined {
  const inputTokens = usage?.input_tokens ?? usage?.prompt_tokens;
  const outputTokens = usage?.output_tokens ?? usage?.completion_tokens;
  const totalTokens = usage?.total_tokens;

  if (
    typeof inputTokens !== 'number' ||
    typeof outputTokens !== 'number' ||
    typeof totalTokens !== 'number'
  ) {
    return undefined;
  }

  return {
    inputTokens,
    outputTokens,
    totalTokens,
  };
}

function assertRealPathWithinRoot(
  rootDir: string,
  absolutePath: string,
  relativePath: string,
): void {
  const resolvedRoot = resolve(rootDir).replace(/\/+$/, '');
  const normalizedRoot = `${resolvedRoot}/`;
  const normalizedAbsolutePath = resolve(absolutePath);

  if (
    normalizedAbsolutePath !== resolvedRoot &&
    !normalizedAbsolutePath.startsWith(normalizedRoot)
  ) {
    throw new BadRequestException(`Path escapes the template root: ${relativePath}`);
  }
}

async function assertStaticBuildExists(
  workspaceDir: string,
  staticBuild: StaticBuildInfo,
): Promise<void> {
  const outputDir = resolve(workspaceDir, staticBuild.outputDir);
  const entryHtml = resolve(workspaceDir, staticBuild.entryHtml);
  const [outputDirStat, entryFileStat] = await Promise.all([
    stat(outputDir).catch(() => null),
    stat(entryHtml).catch(() => null),
  ]);

  if (!outputDirStat?.isDirectory()) {
    throw new BadGatewayException(
      `Static build output directory is missing: ${staticBuild.outputDir}`,
    );
  }

  if (!entryFileStat?.isFile()) {
    throw new BadGatewayException(`Static build entry HTML is missing: ${staticBuild.entryHtml}`);
  }
}

function parseJsonOrRaw(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' ? (value as Record<string, unknown>) : null;
}

function truncateForError(value: string): string {
  return value.length <= 500 ? value : `${value.slice(0, 500)}...`;
}

async function writeJson(path: string, value: unknown): Promise<void> {
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function runningStatus(phase: string, runId: string, templateId: string): Record<string, unknown> {
  return {
    phase,
    status: 'running',
    runId,
    templateId,
  };
}

async function writeStatus(path: string, value: Record<string, unknown>): Promise<void> {
  await writeJson(join(path, 'status.json'), {
    updatedAt: new Date().toISOString(),
    ...value,
  });
}

async function writeFailureArtifacts(
  artifactsDir: string,
  phase: string,
  error: unknown,
  metadata: Record<string, unknown>,
): Promise<void> {
  const message = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  await writeFile(join(artifactsDir, `${phase}-error.txt`), `${message}\n`, 'utf8');
  await writeStatus(artifactsDir, {
    ...metadata,
    phase,
    status: 'failed',
    error: message,
  });
}

async function runCommand(cwd: string, command: string[], timeoutMs: number): Promise<BuildResult> {
  const [file, ...args] = command;
  const startedAt = Date.now();

  return new Promise<BuildResult>((resolvePromise, reject) => {
    const child = spawn(file, args, {
      cwd,
      env: buildProcessEnv(cwd),
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';
    let timedOut = false;
    const timeout = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, timeoutMs);

    child.stdout.on('data', (chunk: Buffer | string) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk: Buffer | string) => {
      stderr += chunk.toString();
    });

    child.on('error', (error) => {
      clearTimeout(timeout);
      reject(new BadGatewayException(`Failed to start build command: ${error.message}`));
    });

    child.on('close', (code) => {
      clearTimeout(timeout);
      if (timedOut) {
        stderr = `${stderr}\nCommand timed out after ${String(timeoutMs)}ms`.trim();
      }

      resolvePromise({
        stdout,
        stderr,
        exitCode: timedOut ? 124 : (code ?? 1),
        durationMs: Date.now() - startedAt,
        timedOut,
      });
    });
  });
}

async function determineInstallCommand(workspaceDir: string): Promise<string[] | null> {
  const packageJson = await readWorkspacePackageJson(workspaceDir);
  const dependencyCount =
    Object.keys(packageJson?.dependencies ?? {}).length +
    Object.keys(packageJson?.devDependencies ?? {}).length;

  if (dependencyCount === 0) {
    return null;
  }

  const hasPnpmLockfile = await pathExists(join(workspaceDir, 'pnpm-lock.yaml'));
  if (hasPnpmLockfile) {
    return ['pnpm', '--dir', workspaceDir, '--ignore-workspace', 'install', '--frozen-lockfile'];
  }

  return ['pnpm', '--dir', workspaceDir, '--ignore-workspace', 'install', '--no-frozen-lockfile'];
}

async function pathExists(path: string): Promise<boolean> {
  return (await stat(path).catch(() => null)) !== null;
}

function buildProcessEnv(cwd: string): NodeJS.ProcessEnv {
  const keys = [
    'CI',
    'COREPACK_HOME',
    'HOME',
    'NODE_ENV',
    'PATH',
    'PNPM_HOME',
    'SHELL',
    'SYSTEMROOT',
    'TEMP',
    'TMP',
    'TMPDIR',
    'USER',
  ] as const;

  const env = Object.fromEntries(
    keys
      .map((key) => [key, process.env[key]])
      .filter((entry): entry is [string, string] => typeof entry[1] === 'string'),
  );

  const localBin = join(cwd, 'node_modules', '.bin');
  const currentPath = env.PATH ?? '';
  env.PATH = currentPath ? `${localBin}${delimiter}${currentPath}` : localBin;

  return env;
}

async function assertTemplateHasNoSymlinks(rootDir: string): Promise<void> {
  const entries = await readdir(rootDir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(rootDir, entry.name);
    const entryStat = await lstat(fullPath);

    if (entryStat.isSymbolicLink()) {
      throw new BadRequestException(`Template contains unsupported symlink: ${entry.name}`);
    }

    if (entry.isDirectory() && !COPY_EXCLUDES.has(entry.name)) {
      await assertTemplateHasNoSymlinks(fullPath);
    }
  }
}

async function determineBuildCommand(workspaceDir: string): Promise<string[]> {
  const packageJson = await readWorkspacePackageJson(workspaceDir);
  const buildScript = packageJson?.scripts?.build;

  if (typeof buildScript === 'string' && buildScript.trim().length > 0) {
    return createScriptCommand(buildScript);
  }

  return ['pnpm', '--dir', workspaceDir, '--ignore-workspace', ...DEFAULT_BUILD_COMMAND];
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'TimeoutError';
}

function getMimeType(path: string): string {
  return MIME_TYPES[extname(path).toLowerCase()] ?? 'application/octet-stream';
}

async function closeServer(server: Server): Promise<void> {
  await new Promise<void>((resolvePromise, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolvePromise();
    });
  });
}

function createScriptCommand(script: string): string[] {
  if (process.platform === 'win32') {
    return ['cmd.exe', '/d', '/s', '/c', script];
  }

  return ['sh', '-lc', script];
}

async function readWorkspacePackageJson(workspaceDir: string): Promise<{
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
} | null> {
  const packageJsonPath = join(workspaceDir, 'package.json');
  const rawPackageJson = await readFile(packageJsonPath, 'utf8').catch(() => null);
  if (!rawPackageJson) {
    return null;
  }

  const parsedPackageJson = parseJsonOrRaw(rawPackageJson);
  return asRecord(parsedPackageJson)
    ? (parsedPackageJson as Record<string, unknown> as {
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
        scripts?: Record<string, string>;
      })
    : null;
}
