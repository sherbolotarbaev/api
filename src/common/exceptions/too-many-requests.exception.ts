import { HttpException, HttpStatus } from '@nestjs/common';

export class TooManyRequestsException extends HttpException {
  constructor(errorMessage: string, timeRemaining?: number) {
    super(
      {
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        error: 'Too Many Requests',
        message: errorMessage,
        timeRemaining,
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
