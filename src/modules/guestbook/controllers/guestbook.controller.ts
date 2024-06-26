import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';

// import { AuthUser, Public } from '~/modules/auth/common/decorators';
import { AuthUser, Public } from '../../auth/common/decorators'; // fix: vercel issue

import { GuestbookService } from '../services';
import {
  GetGuestbookMessagesDto,
  NewGuestbookMessageDto,
  UpdateGuestbookMessageDto,
} from '../dto';

@Controller('guestbook')
@UseInterceptors(CacheInterceptor)
export class GuestbookController {
  constructor(private readonly guestbookService: GuestbookService) {}

  @Post('messages')
  @HttpCode(HttpStatus.OK)
  async newGuestbookMessage(
    @AuthUser() user: IUser,
    @Body() dto: NewGuestbookMessageDto,
  ) {
    return this.guestbookService.newGuestbookMessage(user, dto);
  }

  @Delete('messages/:id')
  @HttpCode(HttpStatus.OK)
  async deleteGuestbookMessage(
    @AuthUser() user: IUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.guestbookService.deleteGuestbookMessage(user, id);
  }

  @Put('messages/:id')
  @HttpCode(HttpStatus.OK)
  async updateGuestbookMessage(
    @AuthUser() user: IUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateGuestbookMessageDto,
  ) {
    return this.guestbookService.updateGuestbookMessage(user, id, dto);
  }

  @Public()
  @Get('messages')
  @HttpCode(HttpStatus.OK)
  async getGuestbookMessages(@Query() queryDto: GetGuestbookMessagesDto) {
    return this.guestbookService.getGuestbookMessages(queryDto);
  }
}
