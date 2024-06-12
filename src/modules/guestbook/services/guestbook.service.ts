import { Injectable, Logger } from '@nestjs/common';

// import { PrismaService } from '~/shared/database/services';
import { PrismaService } from '../../../shared/database/services'; // fix: vercel issue

import { GetGuestbookMessagesDto, NewGuestbookMessageDto } from '../dto';

@Injectable()
export class GuestbookService {
  private readonly logger = new Logger(GuestbookService.name);

  constructor(private readonly prisma: PrismaService) {}

  async newGuestbookMessage(
    dto: NewGuestbookMessageDto,
  ): Promise<IGuestBookMessage> {
    try {
      return this.prisma.guestBookMessage.create({
        data: dto,
      });
    } catch (error) {
      this.logger.error('Failed to create new guestbook message:', error);
      throw new Error(error.message);
    }
  }

  async getGuestbookMessages({ take }: GetGuestbookMessagesDto): Promise<{
    totalCount: number;
    count: number;
    items: IGuestBookMessage[];
  }> {
    const totalCount = await this.prisma.guestBookMessage.count();

    const messages = await this.prisma.guestBookMessage.findMany({
      take,
      orderBy: {
        createdAt: 'desc',
      },
    });

    try {
      return {
        totalCount,
        count: messages.length,
        items: messages,
      };
    } catch (error) {
      this.logger.error('Failed to get guestbook messages:', error);
      throw new Error(error.message);
    }
  }
}
