import { ConfigType, registerAs } from '@nestjs/config';

import { env } from '../global/env';

export const securityRegToken = 'security';

export const SecurityConfig = registerAs(securityRegToken, () => ({
  googleClientId: env('GOOGLE_CLIENT_ID'),
  googleClientSecret: env('GOOGLE_CLIENT_SECRET'),
  googleCallbackUrl: `${env('BASE_URL')}/google/callback`,

  githubClientId: env('GITHUB_CLIENT_ID'),
  githubClientSecret: env('GITHUB_CLIENT_SECRET'),
  githubCallbackUrl: `${env('BASE_URL')}/github/callback`,

  cookieSecret: env('COOKIE_SECRET'),
  sessionSecret: env('SESSION_SECRET'),

  hunterApiKey: env('HUNTER_API_KEY'),

  ipInfoApiKey: env('IP_INFO_API_KEY'),

  telegramBotApiKey: env('TELEGRAM_BOT_API_KEY'),
  telegramBotChatId: env('TELEGRAM_BOT_CHAT_ID'),
}));

export type ISecurityConfig = ConfigType<typeof SecurityConfig>;
