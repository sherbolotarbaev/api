import { AppConfig, IAppConfig, appRegToken } from './app.config';

import {
  SecurityConfig,
  ISecurityConfig,
  securityRegToken,
} from './security.config';

export * from './app.config';
export * from './security.config';

export interface AllConfigType {
  [appRegToken]: IAppConfig;
  [securityRegToken]: ISecurityConfig;
}

export type ConfigKeyPaths = RecordNamePaths<AllConfigType>;

export default {
  AppConfig,
  SecurityConfig,
};
