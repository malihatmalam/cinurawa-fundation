import { DynamicModule, Global, Module, OnModuleInit, Type } from "@nestjs/common";
import { DiscoveryService, ModuleRef } from "@nestjs/core";
import { COMMAND_HANDLER_METADATA, CommandBus, ICommandHandler, IQueryHandler, MediatorService, QUERY_HANDLER_METADATA, QueryBus } from "./Index";

@Global()
@Module({})
export class CqrsModule implements OnModuleInit{
    constructor(
        private readonly moduleRef: ModuleRef,
        private readonly discovery: DiscoveryService,
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) {}

    static forRoot(): DynamicModule {
        return{
            module: CqrsModule,
            providers: [
                CommandBus,
                QueryBus,
                MediatorService,
                DiscoveryService
            ],
            exports: [
                CommandBus,
                QueryBus,
                MediatorService
            ]
        }
    }

    onModuleInit() {
        this.registerCommandHandlers();
        this.registerQueryHandlers();
    }

    private registerCommandHandlers() {
        const providers = this.discovery.getProviders();

        providers.forEach((wrapper) => {
            const { instance, metatype } = wrapper;
            if(!instance || !metatype) return;

            const commandType = Reflect.getMetadata(COMMAND_HANDLER_METADATA, metatype);
            if(commandType) {
                this.commandBus.register(commandType, metatype as Type<ICommandHandler<any, any>>);
            }
        });
    }

    private registerQueryHandlers() {
        const providers = this.discovery.getProviders();
        providers.forEach((wrapper) => {
            const { instance, metatype } = wrapper;
            if(!instance || !metatype) return;

            const queryType = Reflect.getMetadata(QUERY_HANDLER_METADATA, metatype);
            if(queryType) {
                this.queryBus.register(queryType, metatype as Type<IQueryHandler<any, any>>)
            }
        });
    }
}