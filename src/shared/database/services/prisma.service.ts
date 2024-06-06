import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// import { ConfigKeyPaths } from '~/config';
import { ConfigKeyPaths } from '../../../config'; // fix: vercel issue

import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(private readonly configService: ConfigService<ConfigKeyPaths>) {
    super({
      datasources: {
        db: {
          url: configService.get<string>('DATABASE_URL'),
        },
      },
    });
  }

  get session() {
    return this.session;
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Prisma connected to the database successfully');
    } catch (error) {
      this.logger.error('Failed to connect to the database:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('Prisma disconnected from the database successfully');
    } catch (error) {
      this.logger.error('Failed to disconnect from the database:', error);
      throw error;
    }
  }
}
