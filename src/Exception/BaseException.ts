export abstract class BaseException extends Error {
  public readonly timestamp: Date;
  public readonly code: string;
  public readonly context?: Record<string, any>;

  constructor(
    message: string,
    code: string,
    context?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.context = context;
    this.timestamp = new Date();
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON(): Record<string, any> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      timestamp: this.timestamp,
      context: this.context,
    };
  }
}