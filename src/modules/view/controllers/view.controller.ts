import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';

// import { Public } from '~/modules/auth/common/decorators';
import { Public } from '../../auth/common/decorators'; // fix: vercel issue

import { ViewService } from '../services';

@Public()
@Controller('views')
export class ViewController {
  constructor(private readonly viewService: ViewService) {}

  @Get(':slug')
  @HttpCode(HttpStatus.OK)
  async addView(@Param('slug') slug: string) {
    return this.viewService.addView(slug);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getViews() {
    return this.viewService.getViews();
  }
}
