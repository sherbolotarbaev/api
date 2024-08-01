import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  Logger,
  NotImplementedException,
} from '@nestjs/common';

import { MailerService } from '@nestjs-modules/mailer';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

// import { TooManyRequestsException } from '~/common/exceptions/too-many-requests.exception';
import { TooManyRequestsException } from '../../../common/exceptions/too-many-requests.exception'; // fix: vercel issue

// import { type ISecurityConfig, SecurityConfig } from '~/config';
import { type ISecurityConfig, SecurityConfig } from '../../../config'; // fix: vercel issue
import type {
  IHunterResponse,
  IVerificationCodeLimit,
} from '../common/interfaces';

// import { ErrorEnum } from '~/constants/error.constant';
import moment from 'moment';
import { ErrorEnum } from '../../../constants/error.constant'; // fix: vercel issue
import { SendEmailDto, SendVerificationCodeDto, VerifyEmailDto } from '../dto';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    @Inject(SecurityConfig.KEY)
    private readonly securityConfig: ISecurityConfig,
    private readonly httpService: HttpService,
    private readonly mailerService: MailerService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async verifyEmail({ email }: VerifyEmailDto): Promise<boolean> {
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

  async checkVerificationCodeLimit(email: string): Promise<{
    hasLimit: boolean;
    timeRemaining: number;
  }> {
    const userInfo = await this.cacheManager.get<IVerificationCodeLimit>(email);
    const currentTime = moment().unix();

    if (!userInfo || userInfo.expiry < currentTime) {
      await this.cacheManager.set(email, {
        count: 1,
        expiry: moment().add(5, 'minute').unix(),
      });

      return { hasLimit: false, timeRemaining: 0 };
    }

    const timeRemaining = userInfo.expiry - currentTime;

    if (userInfo.count >= 3) {
      return { hasLimit: true, timeRemaining };
    }

    await this.cacheManager.set(email, {
      count: userInfo.count + 1,
      expiry: userInfo.expiry,
    });

    return { hasLimit: false, timeRemaining };
  }

  async sendVerificationCode({
    email,
    code,
  }: SendVerificationCodeDto): Promise<{
    email: string;
    code: string;
  }> {
    const subject = 'Verification Code (Sign in)';
    const template = './verification-code';

    const { hasLimit, timeRemaining } = await this.checkVerificationCodeLimit(
      email,
    );

    if (hasLimit && timeRemaining > 0) {
      const minutesRemaining = Math.ceil(timeRemaining / 60);
      const minuteText = minutesRemaining === 1 ? 'minute' : 'minutes';

      throw new TooManyRequestsException(
        `Please try again in ${minutesRemaining} ${minuteText}.`,
        timeRemaining,
      );
    }

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
