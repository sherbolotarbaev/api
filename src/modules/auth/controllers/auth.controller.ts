import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';

import type { Request, Response } from 'express';

import {
  GoogleOauthGuard,
  MetaOauthGuard,
  GitHubOauthGuard,
} from '../common/guards';
import { AuthUser, Public } from '../common/decorators';

import { AuthService } from '../services';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleOauth(@AuthUser() user: IUser, @Res() response: Response) {
    return this.authService.oauthCallback(user, response);
  }

  @Public()
  @Get('meta/callback')
  @UseGuards(MetaOauthGuard)
  async metaOauth(@AuthUser() user: IUser, @Res() response: Response) {
    return this.authService.oauthCallback(user, response);
  }

  @Public()
  @Get('github/callback')
  @UseGuards(GitHubOauthGuard)
  async githubOauth(@AuthUser() user: IUser, @Res() response: Response) {
    return this.authService.oauthCallback(user, response);
  }

  @Get('logout')
  async logout(@Req() request: Request, @Res() response: Response) {
    return this.authService.logout(request, response);
  }

  @Get('me')
  async getMe(@AuthUser() user: IUser) {
    return user;
  }
}
