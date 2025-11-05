import 'reflect-metadata';
import { DynamicModule, Global, Module, OnModuleInit, Type } from '@nestjs/common';
import { DiscoveryModule, DiscoveryService, ModuleRef } from '@nestjs/core';
import { COMMAND_HANDLER_METADATA, CommandBus, ICommandHandler, IQueryHandler, MediatorService, QUERY_HANDLER_METADATA, QueryBus } from './index';

@Global()
@Module({
  imports: [DiscoveryModule],
  providers: [CommandBus, QueryBus, MediatorService],
  exports: [CommandBus, QueryBus, MediatorService],
})
export class CqrsModule implements OnModuleInit {
  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly discovery: DiscoveryService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  static forRoot(): DynamicModule {
    return {
      module: CqrsModule,
      imports: [DiscoveryModule],
      providers: [CommandBus, QueryBus, MediatorService],
      exports: [CommandBus, QueryBus, MediatorService],
      global: true,
    };
  }

  onModuleInit(): void {
    this.registerCommandHandlers();
    this.registerQueryHandlers();
  }

  private registerCommandHandlers(): void {
    const providers = this.discovery.getProviders();

    providers.forEach((wrapper) => {
      const { instance, metatype } = wrapper;
      if (!instance || !metatype) return;

      const commandType = (Reflect as any).getMetadata(COMMAND_HANDLER_METADATA, metatype);
      if (commandType) {
        this.commandBus.register(commandType, metatype as Type<ICommandHandler<any, any>>);
      }
    });
  }

  private registerQueryHandlers(): void {
    const providers = this.discovery.getProviders();

    providers.forEach((wrapper) => {
      const { instance, metatype } = wrapper;
      if (!instance || !metatype) return;

      const queryType = (Reflect as any).getMetadata(QUERY_HANDLER_METADATA, metatype);
      if (queryType) {
        this.queryBus.register(queryType, metatype as Type<IQueryHandler<any, any>>);
      }
    });
  }
}
