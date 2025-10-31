import { BaseException } from "../BaseException";

export class DomainException extends BaseException {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 'DOMAIN_ERROR', context);
  }
}