import { Query } from '../../../../Cqrs';
import { OrderAggregate } from '../../Domain/Order.aggregate';

export class GetOrderQuery extends Query<OrderAggregate | null> {
  constructor(public readonly orderId: string) {
    super();
  }
}
