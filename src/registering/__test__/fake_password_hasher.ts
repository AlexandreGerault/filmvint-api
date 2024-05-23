import { PasswordHasher } from '#core/registering/gateways/password_hasher'
import {
  HashedPassword,
  PlainPassword,
} from '#core/registering/domain/entities/registration/value_objects/password'

export class FakePasswordHasher implements PasswordHasher {
  async hash(password: PlainPassword): Promise<HashedPassword> {
    return new HashedPassword(password.value())
  }
}
