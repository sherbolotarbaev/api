import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import type { Request } from 'express';

// import { ErrorEnum } from '~/constants/error.constant';
import { ErrorEnum } from '../../../../constants/error.constant'; // fix: vercel issue

import { PUBLIC_KEY } from '../decorators';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as IUser;

    if (!user) return false;

    if (!user.isActive) {
      throw new ForbiddenException(ErrorEnum.USER_DEACTIVATED);
    }

    if (user.role !== 'ADMIN') {
      throw new ForbiddenException(ErrorEnum.ACCESS_DENIED);
    }

    return true;
  }
}
