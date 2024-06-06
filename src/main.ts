import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { NestExpressApplication } from '@nestjs/platform-express';

import type { ConfigKeyPaths } from './config';

import { AppModule } from './app.module';

import { setup } from './setup';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
    snapshot: true,
    // forceCloseConnections: true,
  });

  const configService = app.get(ConfigService<ConfigKeyPaths>);
  const { port, name } = configService.get('app', { infer: true });

  const logger = new Logger(name);

  setup(app);

  try {
    await app.listen(port, '0.0.0.0');
    const url = await app.getUrl();
    logger.log(`Server is running on ${url}`);
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
}
bootstrap();
