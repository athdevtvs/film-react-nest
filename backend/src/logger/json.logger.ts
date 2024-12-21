import { LoggerService, Injectable } from '@nestjs/common';

@Injectable()
export class JsonLogger implements LoggerService {
  private logWithLevel(
    level: 'log' | 'error' | 'warn',
    message: unknown,
    ...optionalParams: unknown[]
  ) {
    const formattedMessage = JSON.stringify({ level, message, optionalParams });
    const output =
      level === 'error'
        ? console.error
        : level === 'warn'
          ? console.warn
          : console.log;
    output(formattedMessage);
  }

  log(message: unknown, ...optionalParams: unknown[]) {
    this.logWithLevel('log', message, ...optionalParams);
  }

  error(message: unknown, ...optionalParams: unknown[]) {
    this.logWithLevel('error', message, ...optionalParams);
  }

  warn(message: unknown, ...optionalParams: unknown[]) {
    this.logWithLevel('warn', message, ...optionalParams);
  }
}
