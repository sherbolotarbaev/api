import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';

import type { Response } from 'express';

import { AuthUser, Public } from '../common/decorators';
import {
  GitHubOauthGuard,
  GoogleOauthGuard,
  LocalOtpGuard,
} from '../common/guards';

import { SendOtpDto } from '../dto';
import { AuthService } from '../services';

@Public()
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google/callback')
  @HttpCode(HttpStatus.OK)
  @UseGuards(GoogleOauthGuard)
  async googleOauth(
    @Query('state') state: string,
    @AuthUser() user: IUser,
    @Res() response: Response,
  ) {
    const queryParams = new URLSearchParams(state);
    const next = queryParams.get('next');
    return this.authService.oauthCallback(user, next, response);
  }

  @Get('github/callback')
  @HttpCode(HttpStatus.OK)
  @UseGuards(GitHubOauthGuard)
  async githubOauth(
    @Query('state') state: string,
    @AuthUser() user: IUser,
    @Res() response: Response,
  ) {
    const queryParams = new URLSearchParams(state);
    const next = queryParams.get('next');
    return this.authService.oauthCallback(user, next, response);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalOtpGuard)
  async loginOtp(@Query('next') next: string, @AuthUser() user: IUser) {
    return {
      email: user.email,
      redirectUrl: `${next || '/'}`,
    };
  }

  @Public()
  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto);
  }
}
