import { DomainEvent } from '../../../../Domain';
import { OrderTotalPrimitives } from '../ValueObject/OrderTotal.value-object';

export class OrderCreatedEvent extends DomainEvent {
  constructor(
    orderId: string,
    public readonly customerId: string,
    public readonly total: OrderTotalPrimitives,
  ) {
    super(orderId);
  }

  getEventData(): Record<string, any> {
    return {
      orderId: this.aggregateId,
      customerId: this.customerId,
      total: this.total,
      occurredOn: this.occurredOn,
      eventType: this.eventType,
    };
  }
}
