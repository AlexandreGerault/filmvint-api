import { EventPublisher } from '#core/event_publisher'
import { Register } from '#core/registering/application/register'
import { RegistrationFactory } from '#core/registering/domain/entities/registration/registration_factory'
import { PasswordHasher } from '#core/registering/domain/gateways/password_hasher'
import { RegistrationGateway } from '#core/registering/domain/gateways/registration_gateway'
import { TrashEmailGateway } from '#core/registering/domain/gateways/trash_email_gateway'
import { AdonisPasswordHasher } from '#core/registering/infrastructure/adonis_password_haser'
import { ApiTrashEmailChecker } from '#core/registering/infrastructure/api_trash_email_checker'
import { LucidRegistrationGateway } from '#core/registering/infrastructure/lucid_registration_gateway'
import { Hash } from '@adonisjs/core/hash'
import type { ApplicationService } from '@adonisjs/core/types'

export default class RegisteringProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {
    this.app.container.singleton(RegistrationGateway, async () => {
      return new LucidRegistrationGateway()
    })

    this.app.container.singleton(PasswordHasher, async (resolver) => {
      return new AdonisPasswordHasher(await resolver.make(Hash))
    })

    this.app.container.singleton(TrashEmailGateway, async () => {
      return new ApiTrashEmailChecker()
    })

    this.app.container.bind(RegistrationFactory, async (resolver) => {
      return new RegistrationFactory(
        await resolver.make(PasswordHasher),
        await resolver.make(TrashEmailGateway),
        await resolver.make(RegistrationGateway)
      )
    })

    this.app.container.singleton(Register, async (resolver) => {
      return new Register(
        await resolver.make(RegistrationGateway),
        await resolver.make(EventPublisher),
        await resolver.make(RegistrationFactory)
      )
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
