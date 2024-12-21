import { Injectable, ConsoleLogger } from '@nestjs/common';

@Injectable()
export class DevLogger extends ConsoleLogger {
  log(message: string) {
    super.log(`[DevLogger] ${message}`);
  }

  error(message: string) {
    super.error(`[DevLogger] ${message}`);
  }

  debug(message: string) {
    super.debug(`[DevLogger] ${message}`);
  }

  fatal(message: string) {
    super.error(`[DevLogger] ${message}`);
  }
}
