import { DomainEvent } from '#core/domain_event'

export class AggregateRoot<T> {
  protected id: T

  protected readonly _domainEvents: DomainEvent[] = []

  constructor(id: T) {
    this.id = id
  }

  protected emit(event: DomainEvent): void {
    this._domainEvents.push(event)
  }

  domainEvents(): Readonly<DomainEvent[]> {
    return this._domainEvents
  }
}
