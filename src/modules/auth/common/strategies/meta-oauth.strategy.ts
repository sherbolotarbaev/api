import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy, Profile } from 'passport-facebook';

// import { type ISecurityConfig, SecurityConfig } from '~/config';
import { type ISecurityConfig, SecurityConfig } from '../../../../config'; // fix: vercel issue
import type { IMetaOauthUser } from '../interfaces';

// import { AuthService } from '~/modules/auth/services';
import { AuthService } from '../../../auth/services'; // fix: vercel issue

@Injectable()
export class MetaOauthStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    @Inject(SecurityConfig.KEY)
    private readonly securityConfig: ISecurityConfig,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: securityConfig.metaClientId,
      clientSecret: securityConfig.metaClientSecret,
      callbackURL: securityConfig.metaCallbackUrl,
      scope: ['public_profile', 'email'],
      profileFields: ['id', 'displayName', 'name', 'emails', 'photos'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: (error: HttpException, user: IUser, info?: any) => void,
  ) {
    if (!profile.emails || !profile.emails.length) {
      return done(new NotFoundException('Email not found.'), null);
    }

    const { name, emails, photos } = profile;

    const metaOauthUser: IMetaOauthUser = {
      name: name?.givenName || profile._json?.first_name,
      surname: name?.familyName || profile._json?.last_name,
      email: emails[0]?.value || profile._json?.email,
      photo: photos[0]?.value,
    };

    const user = await this.authService.validateUser(metaOauthUser);
    done(null, user);
  }
}
