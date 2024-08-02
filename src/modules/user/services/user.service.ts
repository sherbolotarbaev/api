import { Injectable } from '@nestjs/common';

// import { PrismaService } from '~/shared/database/services';
import { PrismaService } from '../../../shared/database/services'; // fix: vercel issue

import { CreateUserDto, UpdateUserDto } from '../dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  private UserInlude = {
    metaData: {
      select: {
        ip: true,
        city: true,
        region: true,
        country: true,
        timezone: true,
        lastSeen: true,
        device: true,
      },
    },
  };

  async findAll(): Promise<IUser[] | null> {
    return this.prisma.user.findMany({
      include: this.UserInlude,
    });
  }

  async findById(id: number): Promise<IUser | null> {
    return this.prisma.user.findFirst({
      where: {
        id,
      },
      include: this.UserInlude,
    });
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.prisma.user.findUnique({
      where: {
        email: email.toLowerCase().trim(),
      },
      include: this.UserInlude,
    });
  }

  async createUser(data: CreateUserDto): Promise<IUser> {
    return this.prisma.user.create({
      data,
      include: this.UserInlude,
    });
  }

  async updateUser(userId: number, data: UpdateUserDto): Promise<IUser> {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data,
      include: this.UserInlude,
    });
  }

  async deleteUser(userId: number): Promise<IUser> {
    return this.prisma.user.delete({
      where: {
        id: userId,
      },
      include: this.UserInlude,
    });
  }
}
