import { Register, RegisterProps } from '#core/registering/application/register'
import { InMemoryRegistrationGateway } from '#core/registering/__test__/in_memory_registration_gateway'
import { Registration } from '#core/registering/domain/entities/registration/registration'
import { TrashEmailGateway } from '#core/registering/gateways/trash_email_gateway'
import { HashedPassword } from '#core/registering/domain/entities/registration/value_objects/password'
import { RegistrationFactory } from '#core/registering/domain/entities/registration/registration_factory'
import { Email } from '#core/registering/domain/entities/registration/value_objects/email'
import { Pseudo } from '#core/registering/domain/entities/registration/value_objects/pseudo'
import { RegistrationId } from '#core/registering/domain/entities/registration/registration'
import { EmailValidationToken } from '#core/registering/domain/entities/registration/value_objects/email_validation_token'
import { RegisterTestPresenter } from '#core/registering/__test__/register/register.presenter'
import { InMemoryEventPublisher } from '#core/shared/__tests__/in_memory_event_publisher'
import { FakePasswordHasher } from '#core/registering/__test__/fake_password_hasher'

interface RegisterSUTProps {
  users: Registration[]
  emailIsTrash?: boolean
}

class FakeTrashEmailGateway implements TrashEmailGateway {
  constructor(private readonly _isTrash: boolean) {}

  async isTrash(_email: string): Promise<boolean> {
    return this._isTrash
  }
}

export function registerSUT(props: RegisterSUTProps = { users: [] }) {
  return {
    withExistingEmail(email: string) {
      return registerSUT({
        ...props,
        users: [
          ...props.users,
          new Registration(
            RegistrationId.of('1'),
            new Email(email),
            new Pseudo('pseudo'),
            new HashedPassword('Password_0!'),
            false,
            false,
            new EmailValidationToken('token')
          ),
        ],
      })
    },
    withExistingPseudo(pseudo: string) {
      return registerSUT({
        ...props,
        users: [
          ...props.users,
          new Registration(
            RegistrationId.of('1'),
            new Email('email@example.com'),
            new Pseudo(pseudo),
            new HashedPassword('Password_0!'),
            false,
            false,
            new EmailValidationToken('token')
          ),
        ],
      })
    },
    considerEmailIsTrash() {
      return registerSUT({
        ...props,
        emailIsTrash: true,
      })
    },
    build() {
      const registrationGateway = new InMemoryRegistrationGateway(props.users)

      const presenter = new RegisterTestPresenter()

      const eventPublisher = new InMemoryEventPublisher()

      const registrationFactory = new RegistrationFactory(
        new FakePasswordHasher(),
        new FakeTrashEmailGateway(props.emailIsTrash || false),
        registrationGateway
      )

      const registerUseCase = new Register(registrationGateway, eventPublisher, registrationFactory)

      const registerUser = (input: RegisterProps) => {
        return registerUseCase.execute(input, presenter)
      }

      return {
        registrationGateway,
        registerUser,
        getResponse: () => presenter.response,
        getErrors: () => presenter.errors,
        getEvents: () => eventPublisher.events,
      }
    },
  }
}
