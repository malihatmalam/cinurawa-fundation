export interface IQuery<TResult = any> {
    readonly QueryId: string;
    readonly Timestamp: Date;
}

export abstract class Query<TResult = any> implements IQuery<TResult> {
    public readonly QueryId: string;
    public readonly Timestamp: Date;

    constructor() {
        this.QueryId = crypto.randomUUID();
        this.Timestamp = new Date();
    }
}