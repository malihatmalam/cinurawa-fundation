import { Injectable } from '@nestjs/common';
import { OrderAggregate } from '../Domain/Order.aggregate';

@Injectable()
export class InMemoryOrderRepository {
  private readonly items = new Map<string, OrderAggregate>();

  async save(order: OrderAggregate): Promise<void> {
    if (!order.id) {
      throw new Error('Order must have an identifier before being persisted.');
    }

    this.items.set(order.id, order);
  }

  async findById(orderId: string): Promise<OrderAggregate | null> {
    return this.items.get(orderId) ?? null;
  }

  clear(): void {
    this.items.clear();
  }

  get count(): number {
    return this.items.size;
  }
}
