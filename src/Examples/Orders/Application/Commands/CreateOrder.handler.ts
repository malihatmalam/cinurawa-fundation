import { CommandHandler, ICommandHandler } from '../../../../Cqrs';
import { DomainException } from '../../../../Exception';
import { OrderAggregate } from '../../Domain/Order.aggregate';
import { OrderTotal } from '../../Domain/ValueObject/OrderTotal.value-object';
import { InMemoryOrderRepository } from '../../Infrastructure/InMemoryOrder.repository';
import { CreateOrderCommand } from './CreateOrder.command';

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand, OrderAggregate> {
  constructor(private readonly repository: InMemoryOrderRepository) {}

  async execute(command: CreateOrderCommand): Promise<OrderAggregate> {
    const totalResult = OrderTotal.create(command.totalAmount, command.currency);
    if (totalResult.isFailure) {
      throw new DomainException(totalResult.error!, {
        amount: command.totalAmount,
        currency: command.currency,
      });
    }

    const order = OrderAggregate.create({
      orderId: command.orderId,
      customerId: command.customerId,
      total: totalResult.value,
    });

    await this.repository.save(order);

    return order;
  }
}
