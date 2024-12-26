import { LoggerService, Injectable } from '@nestjs/common';
import { Logger as WinstonLogger } from 'winston';
import { winstonConfig } from './logger.config';
import * as winston from 'winston';

@Injectable()
class TskvLogger implements LoggerService {
  private logger: WinstonLogger;

  constructor() {
    this.logger = winston.createLogger(winstonConfig);
  }

  private formatMessage(
    level: 'info' | 'error' | 'warn' | 'debug',
    message: unknown,
    optionalParams: unknown[],
  ): string {
    // Если OptionalParams пуст, полностью опускаем часть с OptionalParams
    const params =
      optionalParams.length > 0
        ? `\toptionalParams=${JSON.stringify(optionalParams)}`
        : '';

    // Возвращает отформатированное сообщение без лишних пробелов
    return `level=${level}\tmessage=${JSON.stringify(message)}${params}`;
  }

  private logWithLevel(
    level: 'info' | 'error' | 'warn' | 'debug',
    message: unknown,
    ...optionalParams: unknown[]
  ): void {
    const formattedMessage = this.formatMessage(level, message, optionalParams);
    this.logger.log(level, formattedMessage);
  }

  log(message: unknown, ...optionalParams: unknown[]): void {
    this.logWithLevel('info', message, ...optionalParams);
  }

  error(message: unknown, ...optionalParams: unknown[]): void {
    this.logWithLevel('error', message, ...optionalParams);
  }

  warn(message: unknown, ...optionalParams: unknown[]): void {
    this.logWithLevel('warn', message, ...optionalParams);
  }

  debug(message: unknown, ...optionalParams: unknown[]): void {
    this.logWithLevel('debug', message, ...optionalParams);
  }
}

export default TskvLogger;
