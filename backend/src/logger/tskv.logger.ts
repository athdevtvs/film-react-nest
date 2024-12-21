import { LoggerService, Injectable } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  private formatMessage(
    level: 'log' | 'error' | 'warn',
    message: unknown,
    optionalParams: unknown[],
  ): string {
    const params =
      optionalParams.length > 0 ? JSON.stringify(optionalParams) : '';
    return `level=${level}\tmessage=${JSON.stringify(message)}\toptionalParams=${params}\n`;
  }

  private logWithLevel(
    level: 'log' | 'error' | 'warn',
    message: unknown,
    ...optionalParams: unknown[]
  ): void {
    const formattedMessage = this.formatMessage(level, message, optionalParams);
    const output =
      level === 'error'
        ? console.error
        : level === 'warn'
          ? console.warn
          : console.log;
    output(formattedMessage);
  }

  log(message: unknown, ...optionalParams: unknown[]): void {
    this.logWithLevel('log', message, ...optionalParams);
  }

  error(message: unknown, ...optionalParams: unknown[]): void {
    this.logWithLevel('error', message, ...optionalParams);
  }

  warn(message: unknown, ...optionalParams: unknown[]): void {
    this.logWithLevel('warn', message, ...optionalParams);
  }
}
