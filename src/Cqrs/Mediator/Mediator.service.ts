import { Injectable } from "@nestjs/common";
import { IMediator } from "./IMediator.interface";
import { CommandBus } from "../Command/CommandBus";
import { QueryBus } from "../Query/QueryBus";
import { ICommand } from "../Command/ICommand.interface";
import { IQuery } from "../Query/IQuery.interface";

@Injectable()
export class MediatorService implements IMediator {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ){}

    async send<TResult>(
        request: ICommand | IQuery<TResult>
    ): Promise<TResult> {
        if(this.isCommand(request)) {
            return await this.commandBus.execute(request);
        } else if (this.isQuery(request)) {
            return await this.queryBus.execute(request);
        }
        throw new Error('Invalid request type');
    }

    private isCommand(request: any): request is ICommand {
        return'commandId' in request;
    }

    private isQuery(request: any): request is IQuery {
        return 'queryId' in request;
    }
}