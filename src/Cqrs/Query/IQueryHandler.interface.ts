import { IQuery } from "./IQuery.interface";

export interface IQueryHandler<TQuery extends IQuery<TResult>, TResult = any> {
    execute(query: TQuery): Promise<TResult>;
}