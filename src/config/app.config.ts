import { ConfigType, registerAs } from '@nestjs/config';

import { env, envNumber } from '../global/env';

export const appRegToken = 'app';

export const AppConfig = registerAs(appRegToken, () => ({
  nodeEnvironment: env('NODE_ENV'),
  name: env('NAME'),
  port: envNumber('PORT', 3000),
  baseUrl: env('BASE_URL'),
  frontBaseUrl: env('FRONT_END_BASE_URL'),
  frontAuthUrl: env('FRONT_END_AUTH_URL'),
}));

export type IAppConfig = ConfigType<typeof AppConfig>;
