import { ConfigType, registerAs } from '@nestjs/config';

import { env } from '../global/env';

export const securityRegToken = 'security';

export const SecurityConfig = registerAs(securityRegToken, () => ({
  googleClientId: env('GOOGLE_CLIENT_ID'),
  googleClientSecret: env('GOOGLE_CLIENT_SECRET'),
  googleCallbackUrl: `${env('BASE_URL')}/google/callback`,

  metaClientId: env('META_CLIENT_ID'),
  metaClientSecret: env('META_CLIENT_SECRET'),
  metaCallbackUrl: `${env('BASE_URL')}/meta/callback`,

  cookieSecret: env('COOKIE_SECRET'),
  sessionSecret: env('SESSION_SECRET'),
}));

export type ISecurityConfig = ConfigType<typeof SecurityConfig>;
