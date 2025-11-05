import { IQueryHandler, QueryHandler } from '../../../../Cqrs';
import { OrderAggregate } from '../../Domain/Order.aggregate';
import { InMemoryOrderRepository } from '../../Infrastructure/InMemoryOrder.repository';
import { GetOrderQuery } from './GetOrder.query';

@QueryHandler(GetOrderQuery)
export class GetOrderHandler implements IQueryHandler<GetOrderQuery, OrderAggregate | null> {
  constructor(private readonly repository: InMemoryOrderRepository) {}

  async execute(query: GetOrderQuery): Promise<OrderAggregate | null> {
    return this.repository.findById(query.orderId);
  }
}
