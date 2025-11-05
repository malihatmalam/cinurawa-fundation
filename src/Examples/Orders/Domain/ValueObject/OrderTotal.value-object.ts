import { DomainException } from '../../../../Exception';
import { ValueObject } from '../../../../Domain';
import { Guard, Result } from '../../../../Shared';

export interface OrderTotalPrimitives {
  readonly amount: number;
  readonly currency: string;
}

const SUPPORTED_CURRENCIES = ['IDR', 'USD', 'EUR'] as const;

export class OrderTotal extends ValueObject<OrderTotalPrimitives> {
  private constructor(private readonly props: OrderTotalPrimitives) {
    super();
  }

  static create(amount: number, currency = 'IDR'): Result<OrderTotal> {
    const amountResult = Guard.againstNonPositiveNumber(amount, 'amount');
    if (amountResult.isFailure) {
      return Result.fail<OrderTotal>(amountResult.error!);
    }

    const currencyResult = Guard.againstEmptyString(currency, 'currency');
    if (currencyResult.isFailure) {
      return Result.fail<OrderTotal>(currencyResult.error!);
    }

    const normalizedCurrency = currency.trim().toUpperCase();
    const supportedCurrencyResult = Guard.isOneOf(normalizedCurrency, SUPPORTED_CURRENCIES, 'currency');
    if (supportedCurrencyResult.isFailure) {
      return Result.fail<OrderTotal>(supportedCurrencyResult.error!);
    }

    return Result.ok(new OrderTotal({ amount, currency: normalizedCurrency }));
  }

  static createOrThrow(amount: number, currency = 'IDR'): OrderTotal {
    const result = OrderTotal.create(amount, currency);
    if (result.isFailure) {
      throw new DomainException(result.error!, { amount, currency });
    }

    return result.value;
  }

  get amount(): number {
    return this.props.amount;
  }

  get currency(): string {
    return this.props.currency;
  }

  toPrimitives(): OrderTotalPrimitives {
    return { ...this.props };
  }

  protected getAtomicValues(): Iterable<unknown> {
    return [this.props.amount, this.props.currency];
  }
}
