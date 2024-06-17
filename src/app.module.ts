import { Module } from '@nestjs/common';

import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

import { ThrottlerGuard, ThrottlerModule, seconds } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';

import { AppController } from './app.controller';

import config from './config';

import { DatabaseModule } from './shared/database';
import { EmailModule } from './shared/email';
import { LocationModule } from './shared/location';
import {
  AuthModule,
  UserModule,
  GuestbookModule,
  ViewModule,
  ContactModule,
} from './modules';
import { SessionAuthGuard } from './modules/auth/common/guards';

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
export class AppModule {}
