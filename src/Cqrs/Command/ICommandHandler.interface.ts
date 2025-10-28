import { ICommand } from "./ICommand.interface";

export interface ICommandHandler<TCommand extends ICommand, TResult = void> {
    execute(command: TCommand): Promise<TResult>;
}