import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidMonthException extends HttpException {
  constructor() {
    super('Invalid month', HttpStatus.FORBIDDEN);
  }
}
