import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';

// import { AdminGuard } from '~/modules/auth/common/guards';
import { AdminGuard } from '../../auth/common/guards'; // fix: vercel issue

import { UserService } from '../services';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  async getUsers() {
    return this.userService.findAll();
  }
}
