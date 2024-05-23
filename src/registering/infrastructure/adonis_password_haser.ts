import {
  HashedPassword,
  PlainPassword,
} from '#core/registering/domain/entities/registration/value_objects/password'
import { PasswordHasher } from '#core/registering/domain/gateways/password_hasher'
import { Hash } from '@adonisjs/core/hash'

export class AdonisPasswordHasher implements PasswordHasher {
  constructor(protected _hasher: Hash) {}

  async hash(password: PlainPassword): Promise<HashedPassword> {
    return new HashedPassword(await this._hasher.make(password.value()))
  }
}
