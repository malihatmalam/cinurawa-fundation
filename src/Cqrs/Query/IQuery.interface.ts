export interface IQuery<TResult = any> {
    readonly queryId: string;
    readonly timestamp: Date;
}

export abstract class Query<TResult = any> implements IQuery<TResult> {
    public readonly queryId: string;
    public readonly timestamp: Date;

    constructor() {
        this.queryId = crypto.randomUUID();
        this.timestamp = new Date();
    }
}