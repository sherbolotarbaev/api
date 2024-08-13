import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import type { Prisma } from '@prisma/client';

// import { PrismaService } from '~/shared/database/services';
import { PrismaService } from '../../../shared/database/services'; // fix: vercel issue

// import { ErrorEnum } from '~/constants/error.constant';
import { ErrorEnum } from '../../../constants/error.constant'; // fix: vercel issue

import {
  GetGuestbookMessagesDto,
  GetGuestbookMessagesResponseModel,
  NewGuestbookMessageDto,
  UpdateGuestbookMessageDto,
} from '../dto';

@Injectable()
export class GuestbookService {
  private GuestBookMessageInclude: Prisma.GuestBookMessageInclude = {
    author: {
      select: {
        name: true,
        email: true,
        photo: true,
        isVerified: true,
      },
    },
    likes: {
      select: {
        userId: true,
      },
    },
  };

  private readonly logger = new Logger(GuestbookService.name);

  constructor(private readonly prisma: PrismaService) {}

  async newGuestbookMessage(
    user: IUser,
    { message }: NewGuestbookMessageDto,
  ): Promise<IGuestBookMessage> {
    try {
      const guestBookMessage = await this.prisma.guestBookMessage.create({
        data: {
          authorId: user.id,
          message,
        },
        include: this.GuestBookMessageInclude,
      });

      return {
        ...guestBookMessage,
        hasLiked: false,
      };
    } catch (error) {
      this.logger.error('Failed to create new guestbook message:', error);
      throw new InternalServerErrorException(
        'Failed to create new guestbook message.',
      );
    }
  }

  async deleteGuestbookMessage(
    user: IUser,
    id: number,
  ): Promise<IGuestBookMessage> {
    const guestBookMessage = await this.prisma.guestBookMessage.findFirst({
      where: {
        id,
        authorId: user.id,
      },
      include: this.GuestBookMessageInclude,
    });

    if (!guestBookMessage) {
      throw new NotFoundException(ErrorEnum.MESSAGE_NOT_FOUND);
    }

    try {
      await this.prisma.likeMessage.deleteMany({
        where: {
          messageId: id,
        },
      });

      const deletedMessage = await this.prisma.guestBookMessage.delete({
        where: {
          id,
          authorId: user.id,
        },
        include: this.GuestBookMessageInclude,
      });

      return {
        ...deletedMessage,
        hasLiked: false,
      };
    } catch (error) {
      this.logger.error('Failed to delete guestbook message:', error);
      throw new InternalServerErrorException(
        'Failed to delete guestbook message.',
      );
    }
  }

  async updateGuestbookMessage(
    user: IUser,
    id: number,
    { message }: UpdateGuestbookMessageDto,
  ): Promise<IGuestBookMessage> {
    const guestBookMessage = await this.prisma.guestBookMessage.findFirst({
      where: {
        id,
        authorId: user.id,
      },
      include: this.GuestBookMessageInclude,
    });

    if (!guestBookMessage) {
      throw new NotFoundException(ErrorEnum.MESSAGE_NOT_FOUND);
    }

    try {
      const updatedMessage = await this.prisma.guestBookMessage.update({
        where: {
          id,
          authorId: user.id,
        },
        data: {
          message,
          isEdited: true,
        },
        include: this.GuestBookMessageInclude,
      });

      const hasLiked = guestBookMessage.likes.some(
        (like) => like.userId === user.id,
      );

      return {
        ...updatedMessage,
        hasLiked,
      };
    } catch (error) {
      this.logger.error('Failed to update guestbook message:', error);
      throw new InternalServerErrorException(
        'Failed to update guestbook message.',
      );
    }
  }

  async getGuestbookMessages(
    user: IUser | undefined,
    { take }: GetGuestbookMessagesDto,
  ): Promise<GetGuestbookMessagesResponseModel> {
    try {
      const [totalCount, messages] = await Promise.all([
        this.prisma.guestBookMessage.count(),
        this.prisma.guestBookMessage.findMany({
          take,
          orderBy: { createdAt: 'desc' },
          include: this.GuestBookMessageInclude,
        }),
      ]);

      const userLikedMessages = user
        ? new Set(
            await this.prisma.likeMessage
              .findMany({
                where: {
                  userId: user.id,
                  messageId: { in: messages.map((m) => m.id) },
                },
                select: { messageId: true },
              })
              .then((likes) => likes.map((like) => like.messageId)),
          )
        : new Set<number>();

      const formattedMessages = messages.map((message) => ({
        ...message,
        hasLiked: userLikedMessages.has(message.id),
      }));

      return {
        totalCount,
        count: messages.length,
        items: formattedMessages,
      };
    } catch (error) {
      this.logger.error('Failed to get guestbook messages:', error);
      throw new InternalServerErrorException(
        'Failed to get guestbook messages.',
      );
    }
  }
}
