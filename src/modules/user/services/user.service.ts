import { Injectable } from '@nestjs/common';

// import { PrismaService } from '~/shared/database/services';
import { PrismaService } from '../../../shared/database/services'; // fix: vercel issue

import { UpdateUserDto } from '../dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<IUser[] | null> {
    return this.prisma.user.findMany();
  }

  async findById(id: number): Promise<IUser | null> {
    return this.prisma.user.findFirst({
      where: {
        id,
      },
    });
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.prisma.user.findUnique({
      where: {
        email: email.toLowerCase().trim(),
      },
    });
  }

  async updateUser(userId: number, data: UpdateUserDto): Promise<IUser> {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data,
    });
  }
}
