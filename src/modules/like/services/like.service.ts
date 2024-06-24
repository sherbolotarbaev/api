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

  async addLike(user: IUser, slug: string): Promise<ILike> {
    const post = await this.prisma.view.findUnique({
      where: {
        slug,
      },
    });

    if (!post) {
      throw new NotFoundException(ErrorEnum.POST_NOT_FOUND);
    }

    const existingLike = await this.prisma.like.findUnique({
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

      return this.prisma.like.create({
        data: {
          slug,
          userId: user.id,
        },
      });
    } catch (error) {
      this.logger.error('Failed to add like:', error);
      throw new Error(error.message);
    }
  }

  async removeLike(user: IUser, slug: string): Promise<ILike> {
    const post = await this.prisma.view.findUnique({
      where: {
        slug,
      },
    });

    if (!post) {
      throw new NotFoundException(ErrorEnum.POST_NOT_FOUND);
    }

    const existingLike = await this.prisma.like.findUnique({
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

      return this.prisma.like.delete({
        where: {
          userId_slug: {
            userId: user.id,
            slug: post.slug,
          },
        },
      });
    } catch (error) {
      this.logger.error('Failed to add like:', error);
      throw new Error(error.message);
    }
  }

  async getLikes(slug: string): Promise<ILike[]> {
    const post = await this.prisma.view.findUnique({
      where: {
        slug,
      },
    });

    if (!post) {
      throw new NotFoundException(ErrorEnum.POST_NOT_FOUND);
    }

    const likes = await this.prisma.like.findMany({
      where: {
        slug: post.slug,
      },
    });

    if (!likes.length) {
      throw new NotFoundException(ErrorEnum.LIKES_NOT_FOUND);
    }

    try {
      return likes;
    } catch (error) {
      this.logger.error('Failed to get likes:', error);
      throw new Error(error.message);
    }
  }
}
