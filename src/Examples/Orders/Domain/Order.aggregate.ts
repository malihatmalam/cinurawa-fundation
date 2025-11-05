import { AggregateRoot } from '../../../Domain';
import { DomainException } from '../../../Exception';
import { Guard } from '../../../Shared';
import { OrderCreatedEvent } from './Events/OrderCreated.event';
import { OrderTotal } from './ValueObject/OrderTotal.value-object';

interface OrderProps {
  customerId: string;
  total: OrderTotal;
  status: 'CREATED' | 'CANCELLED';
}

export interface OrderPrimitives {
  id: string;
  customerId: string;
  total: ReturnType<OrderTotal['toPrimitives']>;
  status: OrderProps['status'];
}

export class OrderAggregate extends AggregateRoot<string> {
  private constructor(id: string, private readonly props: OrderProps) {
    super(id);
  }

  static create(params: { orderId: string; customerId: string; total: OrderTotal }): OrderAggregate {
    const { orderId, customerId, total } = params;

    const guardResult = Guard.combine([
      Guard.againstEmptyString(orderId, 'orderId'),
      Guard.againstEmptyString(customerId, 'customerId'),
    ]);

    if (guardResult.isFailure) {
      throw new DomainException(guardResult.error!, { orderId, customerId });
    }

    const order = new OrderAggregate(orderId.trim(), {
      customerId: customerId.trim(),
      total,
      status: 'CREATED',
    });

    order.raiseDomainEvent(new OrderCreatedEvent(order.id!, order.customerId, total.toPrimitives()));

    return order;
  }

  get customerId(): string {
    return this.props.customerId;
  }

  get total(): OrderTotal {
    return this.props.total;
  }

  get status(): OrderProps['status'] {
    return this.props.status;
  }

  toPrimitives(): OrderPrimitives {
    return {
      id: this.id!,
      customerId: this.customerId,
      total: this.total.toPrimitives(),
      status: this.status,
    };
  }
}
