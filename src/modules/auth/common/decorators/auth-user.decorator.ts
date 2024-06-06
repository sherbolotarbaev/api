import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import type { Request } from 'express';

type Payload = keyof IUser;

export const AuthUser = createParamDecorator(
  (data: Payload, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as IUser;

    return data ? user?.[data] : user;
  },
);
