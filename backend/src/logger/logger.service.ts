import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { DevLogger, JsonLogger, TskvLogger } from './index';

type LoggerType = 'json' | 'tskv' | 'dev';

export interface Logger {
  log: (message: string, ...optionalParams: unknown[]) => void;
  error: (message: string, ...optionalParams: unknown[]) => void;
  warn: (message: string, ...optionalParams: unknown[]) => void;
  debug?: (message: string, ...optionalParams: unknown[]) => void;
  fatal?: (message: string, ...optionalParams: unknown[]) => void;
}

@Injectable()
export class LoggerService implements NestLoggerService {
  private activeLogger: Logger;

  constructor(
    private readonly devLogger: DevLogger,
    private readonly jsonLogger: JsonLogger,
    private readonly tskvLogger: TskvLogger,
  ) {
    const loggerType = (process.env.LOGGER_TYPE || 'dev') as LoggerType;
    this.activeLogger = this.getLoggerInstance(loggerType);
  }

  private getLoggerInstance(type: LoggerType): Logger {
    const loggerMap: Record<LoggerType, Logger> = {
      json: this.jsonLogger,
      tskv: this.tskvLogger,
      dev: this.devLogger,
    };

    return loggerMap[type];
  }

  setLoggerType(type: string) {
    this.activeLogger = this.getLoggerInstance(type as LoggerType);
  }

  log(message: string, ...optionalParams: unknown[]) {
    this.activeLogger.log(message, ...optionalParams);
  }

  error(message: string, ...optionalParams: unknown[]) {
    this.activeLogger.error(message, ...optionalParams);
  }

  warn(message: string, ...optionalParams: unknown[]) {
    this.activeLogger.warn(message, ...optionalParams);
  }

  debug(message: string, ...optionalParams: unknown[]) {
    if ('debug' in this.activeLogger) {
      this.activeLogger.debug(message, ...optionalParams);
    }
  }

  fatal(message: string, ...optionalParams: unknown[]) {
    if ('fatal' in this.activeLogger) {
      this.activeLogger.fatal(message, ...optionalParams);
    }
  }
}
