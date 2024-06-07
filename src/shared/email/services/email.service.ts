import {
  Inject,
  Injectable,
  Logger,
  NotImplementedException,
} from '@nestjs/common';

import { MailerService } from '@nestjs-modules/mailer';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

// import { type ISecurityConfig, SecurityConfig } from '~/config';
import { type ISecurityConfig, SecurityConfig } from '../../../config'; // fix: vercel issue
import type { IHunterResponse } from '../common/interfaces';

// import { ErrorEnum } from '~/constants/error.constant';
import { ErrorEnum } from '../../../constants/error.constant'; // fix: vercel issue
import { VerifyEmailDto, SendEmailDto, SendVerificationCodeDto } from '../dto';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    @Inject(SecurityConfig.KEY)
    private readonly securityConfig: ISecurityConfig,
    private readonly httpService: HttpService,
    private readonly mailerService: MailerService,
  ) {}

  async verifyEmail({ email }: VerifyEmailDto) {
    try {
      const {
        data: { data },
      } = await firstValueFrom(
        this.httpService.get<IHunterResponse>(
          `https://api.hunter.io/v2/email-verifier?email=${email}&api_key=${this.securityConfig.hunterApiKey}`,
        ),
      );

      return (
        data.status === 'valid' &&
        data.regexp === true &&
        data.result === 'deliverable'
      );
    } catch (error) {
      this.logger.error('Failed to verify email:', error);
      throw new Error(error.message);
    }
  }

  async sendEmail({ email, subject, content, type }: SendEmailDto) {
    if (type === 'text') {
      return this.mailerService.sendMail({
        to: email,
        subject,
        text: content,
      });
    } else {
      return this.mailerService.sendMail({
        to: email,
        subject,
        html: content,
      });
    }
  }

  async sendVerificationCode({ email, code }: SendVerificationCodeDto) {
    const subject = 'Verification Code (Sign in)';
    const template = './verification-code';

    try {
      await this.mailerService.sendMail({
        to: email,
        subject,
        template,
        context: {
          code,
        },
      });
    } catch (error) {
      this.logger.error('Failed to send verification code:', error);
      throw new NotImplementedException(
        ErrorEnum.VERIFICATION_CODE_SEND_FAILED,
      );
    }

    return {
      email,
      code,
    };
  }
}
