import { EventPublisher } from '#core/event_publisher'
import { Registration } from '#core/registering/domain/entities/registration/registration'
import { RegistrationGateway } from '#core/registering/gateways/registration_gateway'
import { RegistrationFactory } from '#core/registering/domain/entities/registration/registration_factory'
import { RegistrationError } from '#core/registering/domain/entities/registration/registration_exception'

export interface RegisterProps {
  email: string
  pseudo: string
  password: string
}

export abstract class RegisterPresenter {
  abstract validationFailed(errors: RegistrationError[]): void
  abstract userRegistered(user: Registration): void
}

export class Register {
  constructor(
    private readonly registrationGateway: RegistrationGateway,
    private readonly eventPublisher: EventPublisher,
    private readonly registrationFactory: RegistrationFactory
  ) {}

  async execute(input: RegisterProps, presenter: RegisterPresenter): Promise<void> {
    const user = await this.registrationFactory.create(input.email, input.pseudo, input.password)

    return user.cata({
      Ok: async (_user) => {
        await this.registrationGateway.save(_user)

        this.eventPublisher.publish([..._user.domainEvents()])

        presenter.userRegistered(_user)
      },
      Err: (error) => {
        presenter.validationFailed(error.errors)
      },
    })
  }
}
