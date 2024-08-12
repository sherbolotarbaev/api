import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

// import { PrismaService } from '~/shared/database/services';
import { PrismaService } from '../../../shared/database/services'; // fix: vercel issue

// import { ErrorEnum } from '~/constants/error.constant';
import { ErrorEnum } from '../../../constants/error.constant'; // fix: vercel issue

@Injectable()
export class LikeService {
  private readonly logger = new Logger(LikeService.name);

  constructor(private readonly prisma: PrismaService) {}

  async addPostLike(user: IUser, slug: string): Promise<ILikePost> {
    const post = await this.prisma.view.findUnique({
      where: {
        slug,
      },
    });

    if (!post) {
      throw new NotFoundException(ErrorEnum.POST_NOT_FOUND);
    }

    const existingLike = await this.prisma.likePost.findUnique({
      where: {
        userId_slug: {
          userId: user.id,
          slug: post.slug,
        },
      },
    });

    if (existingLike) {
      throw new ConflictException(ErrorEnum.LIKE_EXISTS);
    }

    try {
      await this.prisma.view.update({
        where: {
          slug: post.slug,
        },
        data: {
          likesCount: {
            increment: 1,
          },
        },
      });

      return this.prisma.likePost.create({
        data: {
          slug,
          userId: user.id,
        },
      });
    } catch (error) {
      this.logger.error('Failed to add like to post:', error);
      throw new Error(error.message);
    }
  }

  async removePostLike(user: IUser, slug: string): Promise<ILikePost> {
    const post = await this.prisma.view.findUnique({
      where: {
        slug,
      },
    });

    if (!post) {
      throw new NotFoundException(ErrorEnum.POST_NOT_FOUND);
    }

    const existingLike = await this.prisma.likePost.findUnique({
      where: {
        userId_slug: {
          userId: user.id,
          slug: post.slug,
        },
      },
    });

    if (!existingLike) {
      throw new ConflictException(ErrorEnum.LIKE_NOT_FOUND);
    }

    try {
      await this.prisma.view.update({
        where: {
          slug: post.slug,
        },
        data: {
          likesCount: {
            decrement: 1,
          },
        },
      });

      return this.prisma.likePost.delete({
        where: {
          userId_slug: {
            userId: user.id,
            slug: post.slug,
          },
        },
      });
    } catch (error) {
      this.logger.error('Failed to remove post like:', error);
      throw new Error(error.message);
    }
  }

  async getPostLikes(slug: string): Promise<ILikePost[]> {
    const post = await this.prisma.view.findUnique({
      where: {
        slug,
      },
    });

    if (!post) {
      throw new NotFoundException(ErrorEnum.POST_NOT_FOUND);
    }

    const likes = await this.prisma.likePost.findMany({
      where: {
        slug: post.slug,
      },
    });

    try {
      return likes;
    } catch (error) {
      this.logger.error('Failed to get post likes:', error);
      throw new Error(error.message);
    }
  }

  async addMessageLike(user: IUser, id: number): Promise<ILikeMessage> {
    const message = await this.prisma.guestBookMessage.findUnique({
      where: {
        id,
      },
    });

    if (!message) {
      throw new NotFoundException(ErrorEnum.MESSAGE_NOT_FOUND);
    }

    const existingLike = await this.prisma.likeMessage.findUnique({
      where: {
        userId_messageId: {
          userId: user.id,
          messageId: message.id,
        },
      },
    });

    if (existingLike) {
      throw new ConflictException(ErrorEnum.LIKE_EXISTS);
    }

    try {
      await this.prisma.guestBookMessage.update({
        where: {
          id: message.id,
        },
        data: {
          likesCount: {
            increment: 1,
          },
        },
      });

      return this.prisma.likeMessage.create({
        data: {
          messageId: message.id,
          userId: user.id,
        },
      });
    } catch (error) {
      this.logger.error('Failed to add like to message:', error);
      throw new Error(error.message);
    }
  }

  async removeMessageLike(user: IUser, id: number): Promise<ILikeMessage> {
    const message = await this.prisma.guestBookMessage.findUnique({
      where: {
        id,
      },
    });

    if (!message) {
      throw new NotFoundException(ErrorEnum.MESSAGE_NOT_FOUND);
    }

    const existingLike = await this.prisma.likeMessage.findUnique({
      where: {
        userId_messageId: {
          userId: user.id,
          messageId: message.id,
        },
      },
    });

    if (!existingLike) {
      throw new ConflictException(ErrorEnum.LIKE_NOT_FOUND);
    }

    try {
      await this.prisma.guestBookMessage.update({
        where: {
          id: message.id,
        },
        data: {
          likesCount: {
            decrement: 1,
          },
        },
      });

      return this.prisma.likeMessage.delete({
        where: {
          userId_messageId: {
            userId: user.id,
            messageId: message.id,
          },
        },
      });
    } catch (error) {
      this.logger.error('Failed to remove message like:', error);
      throw new Error(error.message);
    }
  }

  async getMessageLikes(id: number): Promise<ILikeMessage[]> {
    const message = await this.prisma.guestBookMessage.findUnique({
      where: {
        id,
      },
    });

    if (!message) {
      throw new NotFoundException(ErrorEnum.MESSAGE_NOT_FOUND);
    }

    const likes = await this.prisma.likeMessage.findMany({
      where: {
        messageId: message.id,
      },
    });

    try {
      return likes;
    } catch (error) {
      this.logger.error('Failed to get message likes:', error);
      throw new Error(error.message);
    }
  }
}
