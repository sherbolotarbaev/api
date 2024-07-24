import { type ExecutionContext, Injectable, Inject } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import type { Request, Response } from 'express';

// import { type IAppConfig, AppConfig } from '~/config';
import { type IAppConfig, AppConfig } from '../../../../config'; // fix: vercel issue

@Injectable()
export class GitHubOauthGuard extends AuthGuard('github') {
  constructor(@Inject(AppConfig.KEY) private readonly appConfig: IAppConfig) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const error = request.query.error;

    if (error) {
      response.redirect(
        `${this.appConfig.frontAuthUrl}/sign-in?error=${error}`,
      );
    }

    const activate = (await super.canActivate(context)) as boolean;
    await super.logIn(request);

    const user = request.session.passport?.user as IUser | undefined;
    request.user = user;

    return activate;
  }
}
