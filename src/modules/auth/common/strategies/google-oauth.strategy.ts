import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';

// import { type ISecurityConfig, SecurityConfig } from '~/config';
import { type ISecurityConfig, SecurityConfig } from '../../../../config'; // fix: vercel issue
import type { GoogleOauthUser } from '../interfaces';

// import { AuthService } from '~/modules/auth/services';
import { AuthService } from '../../../auth/services'; // fix: vercel issue

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(SecurityConfig.KEY)
    private readonly securityConfig: ISecurityConfig,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: securityConfig.googleClientId,
      clientSecret: securityConfig.googleClientSecret,
      callbackURL: securityConfig.googleCallbackUrl,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const { name, emails, photos } = profile;

    const googleOauthUser: GoogleOauthUser = {
      name: name.givenName,
      surname: name.familyName,
      email: emails[0].value,
      photo: photos[0].value.replace('s96-c', 's384-c'), // to get high quality image
    };

    const user = await this.authService.validateUser(googleOauthUser);
    done(null, user);
  }
}
