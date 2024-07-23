import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import type { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP-INFO');

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl, headers } = request;
    const ip =
      headers['x-forwarded-for'] ||
      headers['x-real-ip'] ||
      request.socket.remoteAddress ||
      '';

    const ipAddress = Array.isArray(ip) ? ip[0] : ip;

    const start = Date.now();

    response.on('finish', () => {
      const { statusCode } = response;
      const responseTime = Date.now() - start;
      const logMessage = `[${ipAddress}] | ${method} | ${statusCode} | ${originalUrl} | ${responseTime}ms`;

      this.logger.log(logMessage);
    });

    next();
  }
}
