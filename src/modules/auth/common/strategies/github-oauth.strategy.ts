import { HttpException, Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { HttpService } from '@nestjs/axios';

import type { Request } from 'express';

import { Strategy, Profile } from 'passport-github';
import { firstValueFrom } from 'rxjs';

// import { type ISecurityConfig, SecurityConfig } from '~/config';
import { type ISecurityConfig, SecurityConfig } from '../../../../config'; // fix: vercel issue
import type { IGitHubOauthUser, IGitHubOauthEmails } from '../interfaces';

// import { AuthService } from '~/modules/auth/services';
import { AuthService } from '../../../auth/services'; // fix: vercel issue

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    @Inject(SecurityConfig.KEY)
    private readonly securityConfig: ISecurityConfig,
    private readonly authService: AuthService,
    private readonly httpService: HttpService,
  ) {
    super({
      clientID: securityConfig.githubClientId,
      clientSecret: securityConfig.githubClientSecret,
      callbackURL: securityConfig.githubCallbackUrl,
      scope: ['public_profile', 'user:email'],
      passReqToCallback: true,
    });
  }

  async validate(
    _request: Request,
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: (error: HttpException, user?: IGitHubOauthUser, info?: any) => void,
  ): Promise<void> {
    const { username, displayName, photos } = profile;

    const { data } = await firstValueFrom(
      this.httpService.get<IGitHubOauthEmails[]>(
        'https://api.github.com/user/emails',
        {
          headers: {
            Authorization: `Bearer ${_accessToken}`,
          },
        },
      ),
    );

    const { email } = data.find((email) => email.primary);

    const githubOauthUser: IGitHubOauthUser = {
      name: displayName?.split(' ')[0] || username,
      email,
      surname: displayName?.split(' ')[1] || username,
      photo: photos[0]?.value,
    };

    const user = await this.authService.validateUser(githubOauthUser);
    done(null, user);
  }

  authenticate(request: Request, options: any): void {
    super.authenticate(request, {
      ...options,
      state: `next=${request.query.next || '/'}&source=${request.query.source}`,
    });
  }
}
