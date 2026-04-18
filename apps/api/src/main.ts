import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app-config.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = app.get(AppConfigService);

  app.enableCors({
    origin: config.corsOrigin,
    credentials: true,
  });

  // Validation is per-handler via ZodValidationPipe (see .cursor/rules/zod-dto.mdc).
  // No global ValidationPipe — class-validator / class-transformer are not used.

  app.enableShutdownHooks();

  await app.listen(config.port);
  Logger.log(
    `Gamevine API listening on http://localhost:${String(config.port)} (env=${config.nodeEnv})`,
    'Bootstrap',
  );
}

bootstrap().catch((err: unknown) => {
  Logger.error(err instanceof Error ? err.stack : String(err), 'Bootstrap');
  process.exit(1);
});
