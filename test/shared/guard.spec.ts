import { Guard } from '../../src/Shared';

describe('Guard', () => {
  it('fails when a string argument is empty', () => {
    const result = Guard.againstEmptyString('   ', 'customerId');

    expect(result.isFailure).toBe(true);
    expect(result.error).toBe('customerId is empty');
  });

  it('fails when a number is not positive', () => {
    const result = Guard.againstNonPositiveNumber(0, 'amount');

    expect(result.isFailure).toBe(true);
    expect(result.error).toBe('amount must be greater than zero');
  });

  it('succeeds when value is within range and part of allowed values', () => {
    const rangeResult = Guard.inRange(1, 10, 5, 'rating');
    const allowedResult = Guard.isOneOf('IDR', ['IDR', 'USD'], 'currency');

    expect(rangeResult.isSuccess).toBe(true);
    expect(allowedResult.isSuccess).toBe(true);
  });

  it('aggregates multiple failures through combine', () => {
    const combined = Guard.combine([
      Guard.againstNullOrUndefined(undefined, 'orderId'),
      Guard.againstEmptyString('   ', 'customerId'),
    ]);

    expect(combined.isFailure).toBe(true);
    expect(combined.error).toBe('orderId is null or undefined');
  });

  it('validates multiple arguments at once', () => {
    const result = Guard.againstNullOrUndefinedBulk([
      { argument: 'value', argumentName: 'first' },
      { argument: 10, argumentName: 'second' },
    ]);

    expect(result.isSuccess).toBe(true);
  });
});
