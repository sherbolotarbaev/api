import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

// import { Public } from '~/modules/auth/common/decorators';
import { Public } from '../../auth/common/decorators'; // fix: vercel issue
// import { Ip } from '~/decorators/ip.decorator';
import { Ip } from '../../../decorators/ip.decorator'; // fix: vercel issue

import { ContactService } from '../services';
import { NewContactMessageDto } from '../dto';

@Public()
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async newMessage(@Ip() ip: string, @Body() dto: NewContactMessageDto) {
    return this.contactService.newMessage(ip, dto);
  }
}
