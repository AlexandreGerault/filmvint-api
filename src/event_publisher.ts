import { DomainEvent } from '#core/domain_event'

export abstract class EventPublisher {
  abstract publish(events: DomainEvent | DomainEvent[]): void
}
