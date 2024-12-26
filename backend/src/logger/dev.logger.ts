import { Injectable, ConsoleLogger } from '@nestjs/common';
import { Logger as WinstonLogger } from 'winston';
import { winstonConfig } from './logger.config';
import * as winston from 'winston';
import { Logger } from './logger.service';

@Injectable()
class DevLogger extends ConsoleLogger implements Logger {
  private logger: WinstonLogger;

  constructor() {
    super();
    this.logger = winston.createLogger(winstonConfig);
  }

  log(message: string) {
    this.logger.info(`[DevLogger] ${message}`);
  }

  error(message: string) {
    this.logger.error(`[DevLogger] ${message}`);
  }

  debug(message: string) {
    this.logger.debug(`[DevLogger] ${message}`);
  }

  fatal(message: string) {
    this.logger.error(`[FATAL] ${`[DevLogger] ${message}`}`);
  }
}

export default DevLogger;
