import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '../../src/Cqrs';
import { OrderCreatedEvent } from '../../src/Examples/Orders/Domain/Events/OrderCreated.event';
import { OrderAggregate } from '../../src/Examples/Orders/Domain/Order.aggregate';
import { OrdersModule } from '../../src/Examples/Orders/Orders.module';
import { InMemoryOrderRepository } from '../../src/Examples/Orders/Infrastructure/InMemoryOrder.repository';
import { CreateOrderCommand } from '../../src/Examples/Orders/Application/Commands/CreateOrder.command';
import { GetOrderQuery } from '../../src/Examples/Orders/Application/Queries/GetOrder.query';

describe('Orders example integration', () => {
  let moduleRef: TestingModule;
  let commandBus: CommandBus;
  let queryBus: QueryBus;
  let repository: InMemoryOrderRepository;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [OrdersModule],
    }).compile();

    await moduleRef.init();

    commandBus = moduleRef.get(CommandBus);
    queryBus = moduleRef.get(QueryBus);
    repository = moduleRef.get(InMemoryOrderRepository);
  });

  beforeEach(() => {
    repository.clear();
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  it('creates and persists an order aggregate through the command bus', async () => {
    const command = new CreateOrderCommand('order-1', 'customer-1', 250_000, 'IDR');

    const aggregate = await commandBus.execute<CreateOrderCommand, OrderAggregate>(command);

    expect(aggregate.id).toBe('order-1');
    expect(aggregate.customerId).toBe('customer-1');
    expect(aggregate.total.amount).toBe(250_000);
    expect(aggregate.total.currency).toBe('IDR');
    expect(repository.count).toBe(1);

    const events = aggregate.getDomainEvents();
    expect(events).toHaveLength(1);
    expect(events[0]).toBeInstanceOf(OrderCreatedEvent);
    expect((events[0] as OrderCreatedEvent).total.amount).toBe(250_000);
  });

  it('retrieves an order aggregate through the query bus', async () => {
    const orderId = 'order-2';
    await commandBus.execute(new CreateOrderCommand(orderId, 'customer-2', 125_000));

    const result = await queryBus.execute<GetOrderQuery, OrderAggregate | null>(new GetOrderQuery(orderId));

    expect(result).not.toBeNull();
    expect(result?.id).toBe(orderId);
    expect(result?.customerId).toBe('customer-2');
  });
});
