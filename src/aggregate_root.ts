import { DomainEvent } from '#core/domain_event'

export class AggregateRoot<T> {
  protected _id: T

  protected readonly _domainEvents: DomainEvent[] = []

  constructor(id: T) {
    this._id = id
  }

  public get id() {
    return this._id
  }

  protected emit(event: DomainEvent): void {
    this._domainEvents.push(event)
  }

  domainEvents(): Readonly<DomainEvent[]> {
    return this._domainEvents
  }
}
