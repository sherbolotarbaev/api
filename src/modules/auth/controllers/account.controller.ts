import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  Res,
} from '@nestjs/common';

import type { Request, Response } from 'express';

import { AuthUser } from '../common/decorators';

import { AuthService } from '../services';

@Controller()
export class AccountController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getMe(@AuthUser() user: IUser) {
    return user;
  }

  @Get('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() request: Request, @Res() response: Response) {
    return this.authService.logout(request, response);
  }
}
