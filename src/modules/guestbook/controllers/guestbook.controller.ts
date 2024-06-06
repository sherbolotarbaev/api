import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';

// import { Public } from '~/modules/auth/common/decorators';
import { Public } from '../../auth/common/decorators'; // fix: vercel issue

import { GuestbookService } from '../services';
import { GetGuestbookMessagesDto, NewGuestbookMessageDto } from '../dto';

@Controller('guestbook')
export class GuestbookController {
  constructor(private readonly guestbookService: GuestbookService) {}

  @Public()
  @Post('messages')
  @HttpCode(HttpStatus.OK)
  async newGuestbookMessage(@Body() dto: NewGuestbookMessageDto) {
    return this.guestbookService.newGuestbookMessage(dto);
  }

  @Public()
  @Get('messages')
  @HttpCode(HttpStatus.OK)
  async getGuestbookMessages(@Query() queryDto: GetGuestbookMessagesDto) {
    return this.guestbookService.getGuestbookMessages(queryDto);
  }
}
