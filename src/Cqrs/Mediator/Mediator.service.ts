import { Injectable } from '@nestjs/common';
import { ICommand } from '../Command/ICommand.interface';
import { CommandBus } from '../Command/CommandBus';
import { IQuery } from '../Query/IQuery.interface';
import { QueryBus } from '../Query/QueryBus';
import { IMediator } from './IMediator.interface';

@Injectable()
export class MediatorService implements IMediator {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async send<TResult>(request: ICommand | IQuery<TResult>): Promise<TResult> {
    if (this.isCommand(request)) {
      return this.commandBus.execute(request);
    }

    if (this.isQuery(request)) {
      return this.queryBus.execute(request);
    }

    throw new Error('Invalid request type');
  }

  private isCommand(request: unknown): request is ICommand {
    return typeof request === 'object' && request !== null && 'commandId' in request;
  }

  private isQuery<TResult>(request: unknown): request is IQuery<TResult> {
    return typeof request === 'object' && request !== null && 'queryId' in request;
  }
}
