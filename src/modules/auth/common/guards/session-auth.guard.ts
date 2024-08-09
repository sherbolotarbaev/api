import {
  type ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import type { Request } from 'express';

import { PUBLIC_KEY } from '../decorators';
// import { ErrorEnum } from '~/constants/error.constant';
import { ErrorEnum } from '../../../../constants/error.constant'; // fix: vercel issue

@Injectable()
export class SessionAuthGuard extends AuthGuard('session') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as IUser;

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!user.isActive) {
      throw new ForbiddenException(ErrorEnum.USER_DEACTIVATED);
    }

    return true;
  }
}
