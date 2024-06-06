import { Injectable, Logger, NotFoundException } from '@nestjs/common';

// import { PrismaService } from '~/shared/database/services';
import { PrismaService } from '../../../shared/database/services'; // fix: vercel issue

import { VIEWS_NOT_FOUND } from '../common/constants';

@Injectable()
export class ViewService {
  private readonly logger = new Logger(ViewService.name);

  constructor(private readonly prisma: PrismaService) {}

  async addView(slug: string) {
    try {
      return this.prisma.view.upsert({
        where: {
          slug,
        },
        create: {
          slug,
          count: 1,
        },
        update: {
          count: {
            increment: 1,
          },
        },
      });
    } catch (error) {
      this.logger.error('Failed to add view:', error);
      throw new Error(error.message);
    }
  }

  async getViews() {
    const views = await this.prisma.view.findMany();

    if (!views.length) {
      throw new NotFoundException(VIEWS_NOT_FOUND);
    }

    try {
      return views;
    } catch (error) {
      this.logger.error('Failed to get views:', error);
      throw new Error(error.message);
    }
  }
}
