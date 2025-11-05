import { Result } from '../Result';

type GuardArgument = {
  argument: unknown;
  argumentName: string;
};

export class Guard {
  static combine(results: Array<Result<unknown>>): Result<void> {
    return Result.combine(results);
  }

  static againstNullOrUndefined<T>(argument: T | null | undefined, argumentName: string): Result<void> {
    return argument === null || argument === undefined
      ? Result.fail<void>(`${argumentName} is null or undefined`)
      : Result.ok();
  }

  static againstNullOrUndefinedBulk(args: GuardArgument[]): Result<void> {
    const results = args.map(({ argument, argumentName }) =>
      Guard.againstNullOrUndefined(argument, argumentName),
    );

    return Guard.combine(results);
  }

  static againstEmptyString(value: string | null | undefined, argumentName: string): Result<void> {
    if (value === null || value === undefined) {
      return Result.fail<void>(`${argumentName} is null or undefined`);
    }

    return value.trim().length === 0 ? Result.fail<void>(`${argumentName} is empty`) : Result.ok();
  }

  static againstNonPositiveNumber(value: number, argumentName: string): Result<void> {
    if (!Number.isFinite(value)) {
      return Result.fail<void>(`${argumentName} must be a finite number`);
    }

    return value > 0 ? Result.ok() : Result.fail<void>(`${argumentName} must be greater than zero`);
  }

  static inRange(min: number, max: number, value: number, argumentName: string): Result<void> {
    if (!Number.isFinite(value)) {
      return Result.fail<void>(`${argumentName} must be a finite number`);
    }

    if (value < min || value > max) {
      return Result.fail<void>(`${argumentName} must be between ${min} and ${max}`);
    }

    return Result.ok();
  }

  static isOneOf<T>(value: T, validValues: readonly T[], argumentName: string): Result<void> {
    return validValues.includes(value)
      ? Result.ok()
      : Result.fail<void>(`${argumentName} must be one of: ${validValues.join(', ')}`);
  }

  static all(args: GuardArgument[]): Result<void> {
    const results = args.map(({ argument, argumentName }) =>
      typeof argument === 'string'
        ? Guard.againstEmptyString(argument, argumentName)
        : Guard.againstNullOrUndefined(argument, argumentName),
    );

    return Guard.combine(results);
  }
}
