import { ErrorConstants, ErrorMessageConstants, ExceptionText } from '@foundation/Shared/Constants/ErrorCodeMessageConstants.constant';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import { BaseException } from './BaseException';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = ErrorMessageConstants.InternalServerError;
    let code = ErrorConstants.InternalServerError;
    let errors: unknown = null;

    if (exception instanceof BaseException) {
      status = this.mapExceptionToStatus(exception);
      message = exception.message;
      code = exception.code as ErrorConstants;
      errors = exception.context;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message = typeof exceptionResponse === 'string' ? exceptionResponse : (exceptionResponse as any).message;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    this.logger.error(`${ExceptionText}: ${message}`, exception instanceof Error ? exception.stack : undefined);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      code,
      message,
      errors,
    });
  }

  private mapExceptionToStatus(exception: BaseException): number {
    const statusMap: Record<string, number> = {
      [ErrorConstants.ValidationError]: HttpStatus.BAD_REQUEST,
      DOMAIN_ERROR: HttpStatus.BAD_REQUEST,
    };

    return statusMap[exception.code] ?? HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
