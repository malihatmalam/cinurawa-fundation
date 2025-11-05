import { Injectable, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ICommand } from './ICommand.interface';
import { ICommandHandler } from './ICommandHandler.interface';

@Injectable()
export class CommandBus {
  private readonly handlers = new Map<string, Type<ICommandHandler<any, any>>>();

  constructor(private readonly moduleRef: ModuleRef) {}

  register<T extends ICommand>(commandType: Type<T>, handler: Type<ICommandHandler<T, any>>): void {
    this.handlers.set(commandType.name, handler);
  }

  async execute<TCommand extends ICommand, TResult>(command: TCommand): Promise<TResult> {
    const commandName = command.constructor.name;
    const handlerType = this.handlers.get(commandName);

    if (!handlerType) {
      throw new Error(`No handler registered for command: ${commandName}`);
    }

    const handler = this.moduleRef.get(handlerType, { strict: false });
    return handler.execute(command);
  }
}
