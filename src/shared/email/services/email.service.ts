import { Inject, Injectable, Logger } from '@nestjs/common';

import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

// import { type ISecurityConfig, SecurityConfig } from '~/config';
import { type ISecurityConfig, SecurityConfig } from '../../../config'; // fix: vercel issue
import type { IHunterResponse } from '../common/interfaces';

import { VerifyEmailDto } from '../dto';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    @Inject(SecurityConfig.KEY)
    private readonly securityConfig: ISecurityConfig,
    private readonly httpService: HttpService,
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
}
