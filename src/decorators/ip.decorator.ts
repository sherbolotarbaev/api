import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import type { Request } from 'express';

export const Ip = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    let ip = request.headers['x-forwarded-for'];

    if (!ip) {
      ip =
        request.headers['x-real-ip'] ||
        request.socket.remoteAddress ||
        '127.0.0.1';
    }

    const ipAddress = Array.isArray(ip) ? ip[0] : ip;
    return ipAddress;
  },
);
