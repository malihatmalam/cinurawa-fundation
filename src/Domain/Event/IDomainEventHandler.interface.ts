import { DomainEvent } from "./DomainEvent.base";

export interface IDomainEventHandler<T extends DomainEvent> {
    handle(event: T): Promise<void> | void;   
}