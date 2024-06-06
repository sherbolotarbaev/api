import { Inject, Injectable, Logger } from '@nestjs/common';

// import { PrismaService } from '~/shared/database/services';
import { PrismaService } from '../../../shared/database/services'; // fix: vercel issue

import type { Request, Response } from 'express';

// import { type IAppConfig, AppConfig } from '~/config';
import { type IAppConfig, AppConfig } from '../../../config'; // fix: vercel issue
import type {
  IGitHubOauthUser,
  IGoogleOauthUser,
  IMetaOauthUser,
} from '../common/interfaces';

// import { isDev } from '~/global/env';
import { isDev } from '../../../global/env'; // fix: vercel issue
// import { COOKIE_NAME } from '~/constants/cookie.constant';
import { COOKIE_NAME } from '../../../constants/cookie.constant'; // fix: vercel issue
import { LOGOUT_FAILED } from '../common/constants';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(AppConfig.KEY) private readonly appConfig: IAppConfig,
    private readonly prisma: PrismaService,
  ) {}

  async validateUser({
    name,
    surname,
    email,
    photo,
  }: IGoogleOauthUser | IMetaOauthUser | IGitHubOauthUser) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        return this.prisma.user.create({
          data: {
            name,
            surname,
            email,
            photo,
          },
        });
      }

      return user;
    } catch (error) {
      this.logger.error('Failed to validate user:', error.message);
    }
  }

  async oauthCallback(user: IUser, response: Response) {
    return response
      .status(200)
      .redirect(
        user.isActive
          ? `${this.appConfig.frontBaseUrl}/redirect?to=/guestbook`
          : `${this.appConfig.baseUrl}/logout?next=/sign-in?error=403`,
      );
  }

  async logout(request: Request, response: Response) {
    response.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      path: '/',
      domain: !isDev ? '.sherbolotarbaev.co' : 'localhost',
      sameSite: !isDev ? 'none' : 'lax',
      secure: !isDev,
      maxAge: 0,
    });

    request.logOut((error) => {
      if (error) {
        this.logger.error('Failed to log out:', error.message);
        return response.status(501).send(LOGOUT_FAILED);
      }

      request.session.destroy((error) => {
        if (error) {
          this.logger.error('Failed to destroy session:', error.message);
          return response.status(501).send(LOGOUT_FAILED);
        }

        return response.redirect(
          `${this.appConfig.frontBaseUrl}${request.query.next || '/guestbook'}`,
        );
      });
    });
  }
}
