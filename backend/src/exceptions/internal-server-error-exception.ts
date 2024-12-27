import { HttpException, HttpStatus } from '@nestjs/common';

class InternalServerErrorException extends HttpException {
  constructor(message: string, details?: any) {
    super({ message, details }, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export default InternalServerErrorException;
