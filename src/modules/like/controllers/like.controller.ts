import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';

// import { AuthUser } from '~/modules/auth/common/decorators';
import { AuthUser } from '../../auth/common/decorators'; // fix: vercel issue

import { LikeService } from '../services';

@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post(':slug')
  @HttpCode(HttpStatus.OK)
  async addLike(@AuthUser() user: IUser, @Param('slug') slug: string) {
    return this.likeService.addLike(user, slug);
  }

  @Delete(':slug')
  @HttpCode(HttpStatus.OK)
  async removeLike(@AuthUser() user: IUser, @Param('slug') slug: string) {
    return this.likeService.removeLike(user, slug);
  }

  @Get(':slug')
  @HttpCode(HttpStatus.OK)
  async getLikes(@Param('slug') slug: string) {
    return this.likeService.getLikes(slug);
  }
}
