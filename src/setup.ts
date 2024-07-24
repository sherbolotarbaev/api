import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { NestExpressApplication } from '@nestjs/platform-express';

import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';

import { useContainer } from 'class-validator';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';

import type { ConfigKeyPaths } from './config';
import { isDev } from './global/env';
import { COOKIE_MAX_AGE, COOKIE_NAME } from './constants/cookie.constant';

import { AppModule } from './app.module';
import { PrismaService } from './shared/database/services';

export function setup(app: NestExpressApplication): NestExpressApplication {
  const configService = app.get(ConfigService<ConfigKeyPaths>);
  const prismaService = app.get(PrismaService);

  const { cookieSecret, sessionSecret } = configService.get('security', {
    infer: true,
  });

  const { frontBaseUrl, frontAuthUrl } = configService.get('app', {
    infer: true,
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.use(helmet());

  app.enableCors({
    origin: [frontBaseUrl, frontAuthUrl],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: { enableImplicitConversion: true },
      stopAtFirstError: true,
    }),
  );

  app.use(cookieParser(cookieSecret));

  app.use(
    bodyParser.urlencoded({
      extended: true,
      limit: '10mb',
    }),
  );

  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      name: COOKIE_NAME,
      store: new PrismaSessionStore(prismaService, {
        checkPeriod: 2 * 60 * 1000,
        dbRecordIdIsSessionId: true,
      }),
      cookie: {
        httpOnly: true,
        path: '/',
        domain: !isDev ? '.sherbolotarbaev.co' : 'localhost',
        sameSite: !isDev ? 'none' : 'lax',
        secure: !isDev,
        maxAge: COOKIE_MAX_AGE,
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.set('trust proxy', 1);

  return app;
}
