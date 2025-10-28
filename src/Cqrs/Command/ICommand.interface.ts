export interface ICommand {
    readonly CommandId: string;
    readonly Timestamp: Date;
}

export abstract class Command implements ICommand {
    public readonly CommandId: string; 
    public readonly Timestamp: Date;

    constructor() {
        this.CommandId = crypto.randomUUID();
        this.Timestamp = new Date();
    }
}