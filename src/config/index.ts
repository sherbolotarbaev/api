import { AppConfig, IAppConfig, appRegToken } from './app.config';

import {
  SecurityConfig,
  ISecurityConfig,
  securityRegToken,
} from './security.config';

import { MailerConfig, IMailerConfig, mailerRegToken } from './mailer.config';

export * from './app.config';
export * from './security.config';
export * from './mailer.config';

export interface AllConfigType {
  [appRegToken]: IAppConfig;
  [securityRegToken]: ISecurityConfig;
  [mailerRegToken]: IMailerConfig;
}

export type ConfigKeyPaths = RecordNamePaths<AllConfigType>;

export default {
  AppConfig,
  SecurityConfig,
  MailerConfig,
};
