import { OrderTotal } from '../../src/Examples/Orders/Domain/ValueObject/OrderTotal.value-object';

describe('OrderTotal value object', () => {
  it('creates a value object with normalized currency', () => {
    const result = OrderTotal.create(1000, 'usd');

    expect(result.isSuccess).toBe(true);
    expect(result.value.amount).toBe(1000);
    expect(result.value.currency).toBe('USD');
  });

  it('fails when amount is not positive', () => {
    const result = OrderTotal.create(-5, 'IDR');

    expect(result.isFailure).toBe(true);
    expect(result.error).toBe('amount must be greater than zero');
  });

  it('throws a domain exception when using createOrThrow and validation fails', () => {
    expect(() => OrderTotal.createOrThrow(10, '')).toThrowError('currency is empty');
  });
});
