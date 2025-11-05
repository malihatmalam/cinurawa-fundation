import { Module } from '@nestjs/common';
import { CqrsModule } from '../../Cqrs';
import { CreateOrderHandler } from './Application/Commands/CreateOrder.handler';
import { GetOrderHandler } from './Application/Queries/GetOrder.handler';
import { InMemoryOrderRepository } from './Infrastructure/InMemoryOrder.repository';

@Module({
  imports: [CqrsModule.forRoot()],
  providers: [InMemoryOrderRepository, CreateOrderHandler, GetOrderHandler],
  exports: [InMemoryOrderRepository],
})
export class OrdersModule {}
