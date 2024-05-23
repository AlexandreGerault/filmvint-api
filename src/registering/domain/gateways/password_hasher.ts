import {
  HashedPassword,
  PlainPassword,
} from '#core/registering/domain/entities/registration/value_objects/password'

export abstract class PasswordHasher {
  abstract hash(password: PlainPassword): Promise<HashedPassword>
}
