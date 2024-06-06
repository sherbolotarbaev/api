import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import type { Request } from 'express';

export const Ip = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const ip =
      request.headers['x-real-ip'] ||
      request.headers['x-forwarded-for'] ||
      request.socket.remoteAddress ||
      '';
    const ipAddress = Array.isArray(ip) ? ip[0] : ip;
    return ipAddress;
  },
);
