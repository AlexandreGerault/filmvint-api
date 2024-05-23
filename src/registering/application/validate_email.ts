import { EventPublisher } from '#core/event_publisher'
import { EmailValidationToken } from '#core/registering/domain/entities/registration/value_objects/email_validation_token'
import { RegistrationGateway } from '#core/registering/gateways/registration_gateway'

export interface ValidateEmailProps {
  email: string
  token: string
}

export interface ValidateEmailPresenter {
  emailValidated(): void
  tokenInvalid(): void
}

export class ValidateEmail {
  constructor(
    private registrationGateway: RegistrationGateway,
    private eventPublisher: EventPublisher
  ) {}

  async execute(input: ValidateEmailProps, presenter: ValidateEmailPresenter): Promise<void> {
    const { email, token } = input

    const registration = await this.registrationGateway.findByEmail(email)

    return registration.cata({
      Just: (_registration) => {
        _registration.validateEmail(EmailValidationToken.of(token)).cata({
          Ok: (__registration) => {
            this.registrationGateway.save(__registration)
            presenter.emailValidated()
            this.eventPublisher.publish([...__registration.domainEvents()])
          },
          Err: (_) => {
            presenter.tokenInvalid()
            return
          },
        })
      },
      Nothing: () => {
        // When the email correspond to no registration, we don't want to leak this information
        presenter.tokenInvalid()
      },
    })
  }
}
