import { RegistrationFactory } from '#core/registering/domain/entities/registration/registration_factory'
import { EmailValidationToken } from '#core/registering/domain/entities/registration/value_objects/email_validation_token'
import { FakePasswordHasher } from '#core/registering/__test__/fake_password_hasher'
import { FakeTrashEmailGateway } from '#core/registering/__test__/fake_trash_email_gateway'
import { InMemoryRegistrationGateway } from '#core/registering/__test__/in_memory_registration_gateway'

class RegistrationTestFactory extends RegistrationFactory {
  createForEmail(email: string, emailValidationToken: EmailValidationToken) {
    return this.create(email, 'john_doe', 'Password12!?', emailValidationToken)
  }
}

export function makeRegistrationTestFactory(fakeEmails: string[] = []) {
  return new RegistrationTestFactory(
    new FakePasswordHasher(),
    new FakeTrashEmailGateway(fakeEmails),
    new InMemoryRegistrationGateway()
  )
}
