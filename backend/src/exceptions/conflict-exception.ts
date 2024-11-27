import { HttpException, HttpStatus } from '@nestjs/common';

class ConflictException extends HttpException {
  constructor(message: string, details?: any) {
    super({ message, details }, HttpStatus.CONFLICT);
  }
}

export default ConflictException;
