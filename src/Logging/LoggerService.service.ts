import { Injectable, Logger as NestLogger, Scope } from '@nestjs/common';
import { ILogContext, ILogger } from './ILogger.interface';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService implements ILogger {
  private serviceName: string;
  private context?: string;
  private readonly logger: NestLogger;

  constructor(serviceName: string, context?: string) {
    this.serviceName = serviceName;
    this.context = context;
    this.logger = new NestLogger();
  }

  setContext(context: string): void {
    this.context = context;
  }

  private formatMessage(message: string, context?: ILogContext): string {
    const combinedContext = { ...context };

    if (this.context) {
      combinedContext.context = this.context;
    }

    const entries = Object.entries(combinedContext);
    if (entries.length === 0) {
      return message;
    }

    const contextStr = entries.map(([key, value]) => `${key}=${value}`).join(' ');
    return `LOG - [${this.serviceName}] ${message} | ${contextStr}`;
  }

  log(message: string, context?: ILogContext): void {
    this.logger.log(this.formatMessage(message, context));
  }

  error(message: string, trace?: string, context?: ILogContext): void {
    this.logger.error(this.formatMessage(message, context), trace);
  }

  warn(message: string, context?: ILogContext): void {
    this.logger.warn(this.formatMessage(message, context));
  }

  debug(message: string, context?: ILogContext): void {
    this.logger.debug(this.formatMessage(message, context));
  }

  verbose(message: string, context?: ILogContext): void {
    this.logger.verbose(this.formatMessage(message, context));
  }
}
