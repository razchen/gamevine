import { Global, Inject, Logger, Module, type OnModuleDestroy } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { AppConfigService } from '../config/app-config.service';
import { DRIZZLE, type DrizzleDB } from './database.tokens';
import * as schema from './schema';

const PG_POOL = Symbol('PG_POOL');

@Global()
@Module({
  providers: [
    {
      provide: PG_POOL,
      inject: [AppConfigService],
      useFactory: (config: AppConfigService): Pool => {
        const pool = new Pool({
          connectionString: config.databaseUrl,
          max: 10,
        });
        pool.on('error', (err) => {
          Logger.error(`Unexpected pg pool error: ${err.message}`, err.stack, 'DatabaseModule');
        });
        return pool;
      },
    },
    {
      provide: DRIZZLE,
      inject: [PG_POOL],
      useFactory: (pool: Pool): DrizzleDB => drizzle(pool, { schema }),
    },
  ],
  exports: [DRIZZLE],
})
export class DatabaseModule implements OnModuleDestroy {
  private readonly logger = new Logger(DatabaseModule.name);

  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async onModuleDestroy(): Promise<void> {
    try {
      await this.pool.end();
      this.logger.log('Closed Postgres connection pool');
    } catch (err) {
      this.logger.error(
        `Failed to close Postgres pool: ${(err as Error).message}`,
        (err as Error).stack,
      );
    }
  }
}
