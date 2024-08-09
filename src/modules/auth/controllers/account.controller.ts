import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';

import type { Request, Response } from 'express';

import { AuthUser } from '../common/decorators';
// import { Ip } from '~/decorators/ip.decorator';
import { Ip } from '../../../common/decorators/ip.decorator'; // fix: vercel issue
// import { UserAgent } from '~/common/decorators/user-agent.decorator';
import { UserAgent } from '../../../common/decorators/user-agent.decorator'; // fix: vercel issue

import { AuthService } from '../services';

@Controller()
export class AccountController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getMe(
    @Ip() ip: string,
    @UserAgent() userAgent: string,
    @AuthUser() user: IUser,
  ) {
    return this.authService.getMe(ip, userAgent, user);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() request: Request, @Res() response: Response) {
    return this.authService.logout(request, response);
  }
}
