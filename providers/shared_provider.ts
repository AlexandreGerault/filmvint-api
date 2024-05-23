import { EventPublisher } from '#core/event_publisher'
import { RabbitMqEventPublisher } from '#core/shared/infrastructure/rabbit_mq_event_publisher'
import type { ApplicationService } from '@adonisjs/core/types'

export default class SharedProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {
    this.app.container.singleton(EventPublisher, async () => {
      return new RabbitMqEventPublisher()
    })
  }

  /**
   * The container bindings have booted
   */
  async boot() {}

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
