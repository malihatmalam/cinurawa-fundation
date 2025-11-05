import { LoggerService } from '../LoggerService.service';

export function LogExecution(options?: {
  logArgs?: boolean;
  logResult?: boolean;
  logError?: boolean;
}): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;
    const className = target.constructor.name;
    const methodName = String(propertyKey);

    descriptor.value = async function (...args: any[]) {
      const logger = new LoggerService(`${className}.${methodName}`);
      const startTime = Date.now();

      try {
        if (options?.logArgs) {
          logger.debug(`Executing with args: ${JSON.stringify(args)}`);
        } else {
          logger.debug('Executing');
        }

        const result = await originalMethod.apply(this, args);
        const duration = Date.now() - startTime;

        if (options?.logResult) {
          logger.debug(`Completed in ${duration}ms with result: ${JSON.stringify(result)}`);
        } else {
          logger.debug(`Completed in ${duration}ms`);
        }

        return result;
      } catch (error) {
        const duration = Date.now() - startTime;

        if (options?.logError !== false) {
          logger.error(`Failed after ${duration}ms: ${(error as Error).message}`, (error as Error).stack);
        }

        throw error;
      }
    };

    return descriptor;
  };
}
