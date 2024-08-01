import { HttpException, HttpStatus } from '@nestjs/common';

export class TooManyRequestsException extends HttpException {
  constructor(errorMessage: string) {
    super(
      {
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        error: 'Too Many Requests',
        message: errorMessage,
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
