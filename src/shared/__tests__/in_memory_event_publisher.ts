import { EventPublisher } from '#core/event_publisher'
import { DomainEvent } from '#core/domain_event'

export class InMemoryEventPublisher implements EventPublisher {
  events: DomainEvent[] = []

  publish(events: DomainEvent | DomainEvent[]): void {
    if (Array.isArray(events)) {
      this.events.push(...events)
      return
    }

    this.events.push(events)
  }
}
