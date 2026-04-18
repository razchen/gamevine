import { Test } from '@nestjs/testing';
import { DRIZZLE } from '../database/database.tokens';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('returns ok when the database responds', async () => {
    const db = { execute: jest.fn().mockResolvedValue(undefined) };
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [{ provide: DRIZZLE, useValue: db }],
    }).compile();

    const controller = moduleRef.get(HealthController);
    const result = await controller.check();

    expect(result.status).toBe('ok');
    expect(db.execute).toHaveBeenCalledTimes(1);
    expect(typeof result.timestamp).toBe('string');
    expect(result.uptime).toBeGreaterThanOrEqual(0);
  });

  it('returns degraded when the database throws', async () => {
    const db = { execute: jest.fn().mockRejectedValue(new Error('boom')) };
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [{ provide: DRIZZLE, useValue: db }],
    }).compile();

    const controller = moduleRef.get(HealthController);
    const result = await controller.check();

    expect(result.status).toBe('degraded');
  });
});
