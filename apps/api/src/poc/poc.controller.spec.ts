import { type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type {
  CreateBugFixRunRequest,
  CreateFeatureRunRequest,
  CreateGenerationRunRequest,
  GenerationRunResponse,
} from './poc.dto';
import { PocController } from './poc.controller';
import { PocService } from './poc.service';

describe('PocController', () => {
  let app: INestApplication | undefined;

  afterEach(async () => {
    await app?.close();
    app = undefined;
  });

  it('delegates generation runs to the service', async () => {
    const response = makeResponse();
    const createGenerationRun = jest.fn<
      Promise<GenerationRunResponse>,
      [CreateGenerationRunRequest]
    >();
    createGenerationRun.mockResolvedValue(response);

    const moduleRef = await Test.createTestingModule({
      controllers: [PocController],
      providers: [
        {
          provide: PocService,
          useValue: {
            createBugFixRun: jest.fn(),
            createFeatureRun: jest.fn(),
            createGenerationRun,
          },
        },
      ],
    }).compile();

    const controller = moduleRef.get(PocController);
    const body: CreateGenerationRunRequest = {
      templateId: 'breakout-basic',
      model: 'gpt-5.2',
    };

    await expect(controller.createGenerationRun(body)).resolves.toEqual(response);
    expect(createGenerationRun).toHaveBeenCalledWith(body);
  });

  it.each([
    {
      body: {
        sourceRunId: '2026-04-18T21-55-43.359Z--02762677',
        model: 'gpt-5.2',
      } satisfies CreateFeatureRunRequest,
      methodName: 'createFeatureRun' as const,
      testName: 'feature',
    },
    {
      body: {
        sourceRunId: '2026-04-18T21-55-43.359Z--02762677',
        model: 'gpt-5.2',
      } satisfies CreateBugFixRunRequest,
      methodName: 'createBugFixRun' as const,
      testName: 'bug-fix',
    },
  ])('delegates $testName runs to the service', async ({ body, methodName }) => {
    const response = makeResponse();
    const service = makeServiceMock();
    const handler = jest.fn<Promise<GenerationRunResponse>, [typeof body]>();
    handler.mockResolvedValue(response);
    service[methodName] = handler as (typeof service)[typeof methodName];

    const moduleRef = await Test.createTestingModule({
      controllers: [PocController],
      providers: [
        {
          provide: PocService,
          useValue: service,
        },
      ],
    }).compile();

    const controller = moduleRef.get(PocController);

    await expect(controller[methodName](body)).resolves.toEqual(response);
    expect(handler).toHaveBeenCalledWith(body);
  });

  it('returns 400 for an invalid generation payload before calling the service', async () => {
    const createGenerationRun = jest.fn();
    const moduleRef = await Test.createTestingModule({
      controllers: [PocController],
      providers: [
        {
          provide: PocService,
          useValue: {
            createBugFixRun: jest.fn(),
            createFeatureRun: jest.fn(),
            createGenerationRun,
          },
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    await request(app.getHttpServer())
      .post('/poc/generation-runs')
      .send({
        templateId: 'nested/breakout',
      })
      .expect(400);

    expect(createGenerationRun).not.toHaveBeenCalled();
  });

  it('returns 400 for an invalid feature payload before calling the service', async () => {
    const createFeatureRun = jest.fn();
    const moduleRef = await Test.createTestingModule({
      controllers: [PocController],
      providers: [
        {
          provide: PocService,
          useValue: {
            createBugFixRun: jest.fn(),
            createFeatureRun,
            createGenerationRun: jest.fn(),
          },
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    await request(app.getHttpServer())
      .post('/poc/feature-runs')
      .send({
        sourceRunId: '../../tmp/run',
      })
      .expect(400);

    expect(createFeatureRun).not.toHaveBeenCalled();
  });

  it('returns 400 for an invalid bug-fix payload before calling the service', async () => {
    const createBugFixRun = jest.fn();
    const moduleRef = await Test.createTestingModule({
      controllers: [PocController],
      providers: [
        {
          provide: PocService,
          useValue: {
            createBugFixRun,
            createFeatureRun: jest.fn(),
            createGenerationRun: jest.fn(),
          },
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    await request(app.getHttpServer())
      .post('/poc/bug-fix-runs')
      .send({
        sourceRunId: '../../tmp/run',
      })
      .expect(400);

    expect(createBugFixRun).not.toHaveBeenCalled();
  });
});

function makeResponse(): GenerationRunResponse {
  return {
    runId: 'run-1',
    templateId: 'breakout-basic',
    model: 'gpt-5.2',
    changedFiles: ['src/main.js'],
    summary: 'Updated the game',
    staticBuild: {
      outputDir: 'dist',
      entryHtml: 'dist/index.html',
    },
    preview: {
      url: 'http://127.0.0.1:43123/',
      port: 43123,
    },
    usage: {
      inputTokens: 10,
      outputTokens: 20,
      totalTokens: 30,
    },
    requestDurationMs: 100,
    build: {
      success: true,
      command: ['pnpm', 'build'],
      exitCode: 0,
      durationMs: 200,
      timedOut: false,
      logFile: 'build.log',
    },
  };
}

function makeServiceMock(): Record<
  'createBugFixRun' | 'createFeatureRun' | 'createGenerationRun',
  jest.Mock
> {
  return {
    createBugFixRun: jest.fn(),
    createFeatureRun: jest.fn(),
    createGenerationRun: jest.fn(),
  };
}
