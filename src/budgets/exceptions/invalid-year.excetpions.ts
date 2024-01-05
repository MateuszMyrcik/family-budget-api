import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidYearException extends HttpException {
  constructor() {
    super('Invalid year', HttpStatus.FORBIDDEN);
  }
}
