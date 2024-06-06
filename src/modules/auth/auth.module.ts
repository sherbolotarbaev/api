import { Module } from '@nestjs/common';

import { PassportModule } from '@nestjs/passport';

import { AuthService } from './services';
import { AuthController } from './controllers';

import { UserModule } from '../user/user.module';

import { SessionSerializer } from './common/serializers';
import { GoogleOauthStrategy, MetaOauthStrategy } from './common/strategies';

@Module({
  imports: [PassportModule.register({ session: true }), UserModule],
  providers: [
    AuthService,
    GoogleOauthStrategy,
    MetaOauthStrategy,
    SessionSerializer,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
