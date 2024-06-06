import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';

// import { EmailService } from '~/shared/email/services';
import { EmailService } from '../../../shared/email/services'; // fix: vercel issue
// import { LocationService } from '~/shared/location/services';
import { LocationService } from '../../../shared/location/services'; // fix: vercel issue
import { TelegramService } from 'nestjs-telegram';

// import { ISecurityConfig, SecurityConfig } from '~/config';
import { type ISecurityConfig, SecurityConfig } from '../../../config'; // fix: vercel issue

import { INVALID_EMAIL } from '../common/constants';
import { NewContactMessageDto } from '../dto';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    @Inject(SecurityConfig.KEY)
    private readonly securityConfig: ISecurityConfig,
    private readonly emailService: EmailService,
    private readonly locationService: LocationService,
    private readonly telegram: TelegramService,
  ) {}

  async newMessage(ip: string, { name, email, message }: NewContactMessageDto) {
    const isEmailValid = await this.emailService.verifyEmail({
      email,
    });

    if (!isEmailValid) {
      throw new BadRequestException(INVALID_EMAIL);
    }

    const location = await this.locationService.getLocation({
      ip,
    });

    try {
      const template = () => {
        let msg = `🌐 IP Address: <b>${ip}</b>\n`;
        msg += `👤 Name: <b>${name}</b>\n`;
        msg += `📪 Email: <b>${email}</b>\n`;
        msg += `✉️ Message: <b>${message}</b>\n`;
        msg += `📍 Location: <b>${location.city}, ${location.country}</b>\n`;
        msg += `🕰️ Timezone: <b>${location.timezone}</b>\n`;
        return msg;
      };

      await this.telegram
        .sendMessage({
          chat_id: this.securityConfig.telegramBotChatId,
          text: template(),
          parse_mode: 'html',
        })
        .toPromise();

      return { success: true };
    } catch (error) {
      this.logger.error('Failed to create new message:', error);
      throw new Error(error.message);
    }
  }
}
