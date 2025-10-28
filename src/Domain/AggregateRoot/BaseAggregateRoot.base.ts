import { Entity } from "../Entity/BaseEntity.base";
import { DomainEvent } from "../Event/DomainEvent.base";

export interface IAggregateRoot {
    readonly domainEvents: ReadonlyArray<DomainEvent>;
    clearDomainEvents(): void;
}

export abstract class AggregateRoot<TId = string> extends Entity<TId> implements IAggregateRoot {
    
    domainEvents: DomainEvent[] = [];

    protected constructor(id?: TId){
        super(id ?? (undefined as unknown as TId));
    }

    public getDomainEvents(): ReadonlyArray<DomainEvent> {
        return this.domainEvents;
    }

    public clearDomainEvents(): void {
        this.domainEvents = [];
    }

    protected raiseDomainEvent(event: DomainEvent): void {
        this.domainEvents.push(event);
    }
}