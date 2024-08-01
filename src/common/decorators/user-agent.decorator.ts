import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import type { Request } from 'express';

export const UserAgent = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const userAgent = request.headers['user-agent'];
    return userAgent;
  },
);
