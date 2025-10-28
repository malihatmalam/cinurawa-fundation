import { ICommand } from "../Command/ICommand.interface";
import { IQuery } from "../Query/IQuery.interface";

export interface IMediator {
    send<TResult>(request: ICommand | IQuery<TResult>): Promise<TResult>;
}