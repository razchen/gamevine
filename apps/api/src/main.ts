import 'reflect-metadata';
import { Logger, ValidationPipe } from '@nestjs/common';
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

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

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
