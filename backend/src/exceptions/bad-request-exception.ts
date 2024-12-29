import { HttpException, HttpStatus } from '@nestjs/common';

class BadRequestException extends HttpException {
  constructor(message: string, details?: any) {
    super({ message, details }, HttpStatus.BAD_REQUEST);
  }
}

export default BadRequestException;
