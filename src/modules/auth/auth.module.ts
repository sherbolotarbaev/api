import { Module } from '@nestjs/common';

import { PassportModule } from '@nestjs/passport';
import { HttpModule } from '@nestjs/axios';

import { AuthService } from './services';
import { AuthController } from './controllers';

import { UserModule } from '../user/user.module';

import { SessionSerializer } from './common/serializers';
import {
  GoogleOauthStrategy,
  MetaOauthStrategy,
  GitHubStrategy,
} from './common/strategies';

@Module({
  imports: [PassportModule.register({ session: true }), HttpModule, UserModule],
  providers: [
    AuthService,
    GoogleOauthStrategy,
    MetaOauthStrategy,
    GitHubStrategy,
    SessionSerializer,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
