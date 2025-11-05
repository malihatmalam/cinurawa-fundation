import { Command } from '../../../../Cqrs';

export class CreateOrderCommand extends Command {
  constructor(
    public readonly orderId: string,
    public readonly customerId: string,
    public readonly totalAmount: number,
    public readonly currency: string = 'IDR',
  ) {
    super();
  }
}
