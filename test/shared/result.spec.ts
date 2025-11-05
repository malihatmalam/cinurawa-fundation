import { Result } from '../../src/Shared';

describe('Result', () => {
  it('creates a successful result with a value', () => {
    const result = Result.ok(42);

    expect(result.isSuccess).toBe(true);
    expect(result.isFailure).toBe(false);
    expect(result.value).toBe(42);
  });

  it('creates a failure result and exposes the error message', () => {
    const result = Result.fail<number>('Something went wrong');

    expect(result.isSuccess).toBe(false);
    expect(result.isFailure).toBe(true);
    expect(result.error).toBe('Something went wrong');
    expect(() => result.value).toThrow('InvalidOperation: Cannot retrieve the value from a failed result.');
  });

  it('combines multiple results and returns the first failure', () => {
    const success = Result.ok(true);
    const failure = Result.fail('Invalid input');

    const combined = Result.combine([success, failure, Result.ok('ignored')]);

    expect(combined.isFailure).toBe(true);
    expect(combined.error).toBe('Invalid input');
  });

  it('returns the provided default when unwrapping a failed result', () => {
    const result = Result.fail<number>('no value');

    expect(result.unwrapOr(10)).toBe(10);
    expect(result.unwrapOrElse(() => 15)).toBe(15);
  });

  it('maps a successful value', () => {
    const result = Result.ok(5).map((value) => value * 2);

    expect(result.isSuccess).toBe(true);
    expect(result.value).toBe(10);
  });

  it('provides a helper for nullable inputs', () => {
    const success = Result.fromNullable('hello');
    const failure = Result.fromNullable<string | null>(null, 'Missing value');

    expect(success.isSuccess).toBe(true);
    expect(success.value).toBe('hello');
    expect(failure.isFailure).toBe(true);
    expect(failure.error).toBe('Missing value');
  });
});
