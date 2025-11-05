export interface ILogContext {
  correlationId?: string;
  userId?: string;
  service?: string;
  [key: string]: unknown;
}

export interface ILogger {
  log(message: string, context?: ILogContext): void;
  error(message: string, trace?: string, context?: ILogContext): void;
  warn(message: string, context?: ILogContext): void;
  debug(message: string, context?: ILogContext): void;
  verbose(message: string, context?: ILogContext): void;
}
