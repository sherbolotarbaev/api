import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';

import type { Response } from 'express';

import {
  GoogleOauthGuard,
  MetaOauthGuard,
  GitHubOauthGuard,
  LocalOtpGuard,
} from '../common/guards';
import { AuthUser, Public } from '../common/decorators';

import { AuthService } from '../services';
import { SendOtpDto } from '../dto';

@Public()
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google/callback')
  @HttpCode(HttpStatus.OK)
  @UseGuards(GoogleOauthGuard)
  async googleOauth(@AuthUser() user: IUser, @Res() response: Response) {
    return this.authService.oauthCallback(user, response);
  }

  @Get('meta/callback')
  @HttpCode(HttpStatus.OK)
  @UseGuards(MetaOauthGuard)
  async metaOauth(@AuthUser() user: IUser, @Res() response: Response) {
    return this.authService.oauthCallback(user, response);
  }

  @Get('github/callback')
  @HttpCode(HttpStatus.OK)
  @UseGuards(GitHubOauthGuard)
  async githubOauth(@AuthUser() user: IUser, @Res() response: Response) {
    return this.authService.oauthCallback(user, response);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalOtpGuard)
  async loginOtp(@AuthUser() user: IUser) {
    return user;
  }

  @Public()
  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto);
  }
}
