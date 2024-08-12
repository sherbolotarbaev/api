import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

// import { AuthUser } from '~/modules/auth/common/decorators';
import { AuthUser } from '../../auth/common/decorators'; // fix: vercel issue

import { LikeService } from '../services';

@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post('post/:slug')
  @HttpCode(HttpStatus.OK)
  async addPostLike(@AuthUser() user: IUser, @Param('slug') slug: string) {
    return this.likeService.addPostLike(user, slug);
  }

  @Delete('post/:slug')
  @HttpCode(HttpStatus.OK)
  async removePostLike(@AuthUser() user: IUser, @Param('slug') slug: string) {
    return this.likeService.removePostLike(user, slug);
  }

  @Get('post/:slug')
  @HttpCode(HttpStatus.OK)
  async getPostLikes(@Param('slug') slug: string) {
    return this.likeService.getPostLikes(slug);
  }

  @Post(':id')
  @HttpCode(HttpStatus.OK)
  async addMessageLike(
    @AuthUser() user: IUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.likeService.addMessageLike(user, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async removeMessageLike(
    @AuthUser() user: IUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.likeService.removeMessageLike(user, id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getMessageLikes(@Param('id', ParseIntPipe) id: number) {
    return this.likeService.getMessageLikes(id);
  }
}
