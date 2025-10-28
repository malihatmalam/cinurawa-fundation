export abstract class DomainEvent {
    public readonly occurredOn: Date;
    public readonly aggregateId: string;
    public readonly eventType: string;

    constructor(aggregateId: string) {
        this.aggregateId = aggregateId;
        this.occurredOn = new Date();
        this.eventType = this.constructor.name;
    }

    abstract getEventData(): Record<string, any>;
}