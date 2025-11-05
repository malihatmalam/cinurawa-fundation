export class Result<T> {
  private constructor(
    public readonly isSuccess: boolean,
    private readonly errorMessage?: string,
    private readonly _value?: T,
  ) {
    if (isSuccess && errorMessage) {
      throw new Error('InvalidOperation: A successful result cannot contain an error message.');
    }

    if (!isSuccess && !errorMessage) {
      throw new Error('InvalidOperation: A failed result requires an error message.');
    }

    Object.freeze(this);
  }

  get isFailure(): boolean {
    return !this.isSuccess;
  }

  get error(): string | undefined {
    return this.errorMessage;
  }

  get value(): T {
    if (!this.isSuccess) {
      throw new Error('InvalidOperation: Cannot retrieve the value from a failed result.');
    }

    return this._value as T;
  }

  getValue(): T {
    return this.value;
  }

  unwrapOr(defaultValue: T): T {
    return this.isSuccess ? (this._value as T) : defaultValue;
  }

  unwrapOrElse(factory: () => T): T {
    return this.isSuccess ? (this._value as T) : factory();
  }

  match<TResult>(onSuccess: (value: T) => TResult, onFailure: (error: string) => TResult): TResult {
    if (this.isSuccess) {
      return onSuccess(this._value as T);
    }

    return onFailure(this.errorMessage!);
  }

  map<TResult>(mapper: (value: T) => TResult): Result<TResult> {
    if (this.isFailure) {
      return Result.fail<TResult>(this.errorMessage!);
    }

    try {
      return Result.ok(mapper(this._value as T));
    } catch (error) {
      return Result.fail<TResult>((error as Error).message);
    }
  }

  async mapAsync<TResult>(mapper: (value: T) => Promise<TResult>): Promise<Result<TResult>> {
    if (this.isFailure) {
      return Result.fail<TResult>(this.errorMessage!);
    }

    try {
      return Result.ok(await mapper(this._value as T));
    } catch (error) {
      return Result.fail<TResult>((error as Error).message);
    }
  }

  static ok(): Result<void>;
  static ok<TResult>(value: TResult): Result<TResult>;
  static ok<TResult>(value?: TResult): Result<TResult | void> {
    return new Result<TResult | void>(true, undefined, value);
  }

  static fail<TResult = never>(error: string): Result<TResult> {
    if (!error || error.trim().length === 0) {
      throw new Error('Failure result requires a non-empty error message.');
    }

    return new Result<TResult>(false, error);
  }

  static combine(results: Array<Result<unknown>>): Result<void> {
    for (const result of results) {
      if (result.isFailure) {
        return Result.fail<void>(result.error!);
      }
    }

    return Result.ok();
  }

  static ensure(condition: boolean, error: string): Result<void> {
    return condition ? Result.ok() : Result.fail<void>(error);
  }

  static fromNullable<TResult>(value: TResult | null | undefined, error = 'Value is null or undefined'): Result<TResult> {
    return value === null || value === undefined ? Result.fail<TResult>(error) : Result.ok<TResult>(value);
  }
}
