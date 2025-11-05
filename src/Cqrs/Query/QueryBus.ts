import { Injectable, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { IQuery } from './IQuery.interface';
import { IQueryHandler } from './IQueryHandler.interface';

@Injectable()
export class QueryBus {
  private readonly handlers = new Map<string, Type<IQueryHandler<any, any>>>();

  constructor(private readonly moduleRef: ModuleRef) {}

  register<T extends IQuery<TResult>, TResult>(queryType: Type<T>, handler: Type<IQueryHandler<T, TResult>>): void {
    this.handlers.set(queryType.name, handler);
  }

  async execute<TQuery extends IQuery<TResult>, TResult>(query: TQuery): Promise<TResult> {
    const queryName = query.constructor.name;
    const handlerType = this.handlers.get(queryName);

    if (!handlerType) {
      throw new Error(`No handler registered for query: ${queryName}`);
    }

    const handler = this.moduleRef.get(handlerType, { strict: false });
    return handler.execute(query);
  }
}
