import { HttpException, HttpStatus } from '@nestjs/common';

class NotFoundException extends HttpException {
  constructor(message: string, details?: any) {
    super({ message, details }, HttpStatus.NOT_FOUND);
  }
}

export default NotFoundException;
