import { DomainEvent } from '#core/domain_event'
import { EventPublisher } from '#core/event_publisher'

export class RabbitMqEventPublisher implements EventPublisher {
  async publish(_: DomainEvent) {}
}
