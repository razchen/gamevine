import { Controller, Get, Inject } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import type { HealthResponse } from '@gamevine/shared';
import { DRIZZLE, type DrizzleDB } from '../database/database.tokens';

@Controller('health')
export class HealthController {
  private readonly startedAt = Date.now();

  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  @Get()
  async check(): Promise<HealthResponse> {
    let dbOk = true;
    try {
      await this.db.execute(sql`SELECT 1`);
    } catch {
      dbOk = false;
    }

    return {
      status: dbOk ? 'ok' : 'degraded',
      uptime: Math.floor((Date.now() - this.startedAt) / 1000),
      timestamp: new Date().toISOString(),
    };
  }
}
