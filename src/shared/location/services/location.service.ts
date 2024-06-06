import { Inject, Injectable, Logger } from '@nestjs/common';

// import { type ISecurityConfig, SecurityConfig } from '~/config';
import { type ISecurityConfig, SecurityConfig } from '../../../config'; // fix: vercel issue

import IPinfo from 'node-ipinfo';

import { GetLocationDto } from '../dto';

@Injectable()
export class LocationService {
  private readonly logger = new Logger(LocationService.name);
  private readonly iPinfo: IPinfo;

  constructor(
    @Inject(SecurityConfig.KEY)
    private readonly securityConfig: ISecurityConfig,
  ) {
    this.iPinfo = new IPinfo(this.securityConfig.ipInfoApiKey);
  }

  async getLocation({ ip }: GetLocationDto) {
    try {
      const data = await this.iPinfo.lookupIp(ip);
      return data;
    } catch (error) {
      this.logger.error('Failed to get location:', error);
      throw new Error(error.message);
    }
  }
}
