import { LoggerService, Injectable } from '@nestjs/common';
import { Logger as WinstonLogger } from 'winston';
import { winstonConfig } from './logger.config';
import * as winston from 'winston';

@Injectable()
class JsonLogger implements LoggerService {
  private logger: WinstonLogger;

  constructor() {
    this.logger = winston.createLogger(winstonConfig);
  }

  private logWithLevel(
    level: 'info' | 'error' | 'warn' | 'debug',
    message: unknown,
    ...optionalParams: unknown[]
  ) {
    const formattedMessage = JSON.stringify({ level, message, optionalParams });
    this.logger.log(level, formattedMessage);
  }

  log(message: unknown, ...optionalParams: unknown[]) {
    this.logWithLevel('info', message, ...optionalParams);
  }

  error(message: unknown, ...optionalParams: unknown[]) {
    this.logWithLevel('error', message, ...optionalParams);
  }

  warn(message: unknown, ...optionalParams: unknown[]) {
    this.logWithLevel('warn', message, ...optionalParams);
  }

  debug(message: unknown, ...optionalParams: unknown[]) {
    this.logWithLevel('debug', message, ...optionalParams);
  }
}

export default JsonLogger;
