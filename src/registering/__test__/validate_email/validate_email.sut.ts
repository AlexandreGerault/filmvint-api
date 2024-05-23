import { ValidateEmail } from '#core/registering/application/validate_email'
import { Registration } from '#core/registering/domain/entities/registration/registration'
import { InMemoryRegistrationGateway } from '#core/registering/__test__/in_memory_registration_gateway'
import { ValidateEmailTestPresenter } from '#core/registering/__test__/validate_email/validate_email.presenter'
import { InMemoryEventPublisher } from '#core/shared/__tests__/in_memory_event_publisher'

type Email = `${string}@${string}.${string}` | `${string}@${string}`

interface ValidateEmailSUTProp {
  email: Email
  token: string
  registrations: Registration[]
}

export function validateEmailSUT(
  props: ValidateEmailSUTProp = { email: 'localhost@hotmail', token: 'token', registrations: [] }
) {
  return {
    email(string: Email) {
      return validateEmailSUT({ ...props, email: string })
    },
    token(token: string) {
      return validateEmailSUT({ ...props, token })
    },
    registrations(registrations: Registration[]) {
      return validateEmailSUT({ ...props, registrations })
    },
    build() {
      const presenter = new ValidateEmailTestPresenter()
      const eventPublisher = new InMemoryEventPublisher()

      const registrationGateway = new InMemoryRegistrationGateway(props.registrations)
      const validateEmail = new ValidateEmail(registrationGateway, eventPublisher)

      return {
        validateEmail() {
          validateEmail.execute({ email: props.email, token: props.token }, presenter)
        },
        registrationGateway,
        getResponse() {
          return presenter.getResponse()
        },
        getEvents() {
          return eventPublisher.events
        },
      }
    },
  }
}
