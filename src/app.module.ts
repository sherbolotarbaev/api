import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerGuard, ThrottlerModule, seconds } from '@nestjs/throttler';

import { AppController } from './app.controller';

import config from './config';

import {
  AuthModule,
  ContactModule,
  GuestbookModule,
  LikeModule,
  UserModule,
  ViewModule,
} from './modules';
import { SessionAuthGuard } from './modules/auth/common/guards';
import { DatabaseModule } from './shared/database';
import { EmailModule } from './shared/email';
import { LocationModule } from './shared/location';

import { LoggingMiddleware } from './common/middlewares/logging.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: '.env',
      load: [...Object.values(config)],
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 0, // seconds, 0 means no expiration by default
    }),
    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        errorMessage:
          'Current operation is too frequent, please try again later!',
        throttlers: [{ ttl: seconds(10), limit: 7 }],
      }),
    }),
    DatabaseModule,
    EmailModule,
    LocationModule,
    AuthModule,
    UserModule,
    GuestbookModule,
    ViewModule,
    ContactModule,
    LikeModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: SessionAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
