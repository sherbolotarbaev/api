import { type ExecutionContext, Injectable, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import type { Request, Response } from 'express';

import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

import { LoginOtpDto } from '../../dto';

@Injectable()
export class LocalOtpGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const body = plainToClass(LoginOtpDto, request.body);
    const errors = await validate(body);
    const errorMessages = errors.flatMap(({ constraints }) =>
      Object.values(constraints),
    );

    if (errorMessages.length > 0) {
      response.status(HttpStatus.BAD_REQUEST).send({
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        message: errorMessages,
      });
      return false;
    }

    const activate = (await super.canActivate(context)) as boolean;
    await super.logIn(request);

    const user = request.session.passport?.user as IUser | undefined;
    request.user = user;

    return activate;
  }
}
