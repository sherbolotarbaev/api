import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import type { Request } from 'express';

import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';

// import { type ISecurityConfig, SecurityConfig } from '~/config';
import { type ISecurityConfig, SecurityConfig } from '../../../../config'; // fix: vercel issue
import type { IGoogleOauthUser } from '../interfaces';

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
      passReqToCallback: true,
    });
  }

  async validate(
    _request: Request,
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    const { name, emails, photos } = profile;

    const googleOauthUser: IGoogleOauthUser = {
      name: name.givenName,
      surname: name.familyName,
      email: emails[0].value,
      photo: photos[0].value.replace('s96-c', 's384-c'), // to get high quality image
    };

    const user = await this.authService.validateUser(googleOauthUser);
    done(null, user);
  }

  authenticate(request: Request, options: any): void {
    super.authenticate(request, {
      ...options,
      state: `next=${request.query.next || '/'}&source=${request.query.source}`,
    });
  }
}
