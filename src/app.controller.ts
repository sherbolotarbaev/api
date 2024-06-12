import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { Public } from './modules/auth/common/decorators';

@Controller()
export class AppController {
  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  async main(): Promise<{
    message: string;
  }> {
    return {
      message: 'hello',
    };
  }
}
