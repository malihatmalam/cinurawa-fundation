import { Entity } from '../Entity/BaseEntity.base';
import { DomainEvent } from '../Event/DomainEvent.base';

export interface IAggregateRoot {
  readonly domainEvents: ReadonlyArray<DomainEvent>;
  clearDomainEvents(): void;
}

export abstract class AggregateRoot<TId = string> extends Entity<TId> implements IAggregateRoot {
  private domainEventsInternal: DomainEvent[] = [];

  protected constructor(id?: TId) {
    super(id ?? (undefined as unknown as TId));
  }

  get domainEvents(): ReadonlyArray<DomainEvent> {
    return this.domainEventsInternal;
  }

  protected addDomainEvent(event: DomainEvent): void {
    this.domainEventsInternal.push(event);
  }

  protected raiseDomainEvent(event: DomainEvent): void {
    this.addDomainEvent(event);
  }

  public getDomainEvents(): ReadonlyArray<DomainEvent> {
    return this.domainEventsInternal;
  }

  public clearDomainEvents(): void {
    this.domainEventsInternal = [];
  }
}
