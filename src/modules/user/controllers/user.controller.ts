import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

import { UserService } from '../services';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getUsers() {
    return this.userService.findAll();
  }
}
