export abstract class DomainEvent {
    public readonly OccurredOn: Date;
    public readonly AggregateId: string;
    public readonly EventType: string;

    constructor(aggregateId: string) {
        this.AggregateId = aggregateId;
        this.OccurredOn = new Date();
        this.EventType = this.constructor.name;
    }

    abstract getEventData(): Record<string, any>;
}