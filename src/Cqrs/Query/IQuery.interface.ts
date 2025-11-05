import { randomUUID } from 'crypto';

export interface IQuery<TResult = any> {
  readonly queryId: string;
  readonly timestamp: Date;
}

export abstract class Query<TResult = any> implements IQuery<TResult> {
  public readonly queryId: string;
  public readonly timestamp: Date;

  protected constructor() {
    this.queryId = randomUUID();
    this.timestamp = new Date();
  }
}
