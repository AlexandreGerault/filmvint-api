import { Maybe, tryFind } from 'pratica'
import { Registration } from '#core/registering/domain/entities/registration/registration'
import { RegistrationGateway } from '#core/registering/gateways/registration_gateway'

class InMemoryRegistrationGateway implements RegistrationGateway {
  private _users: Registration[] = []

  constructor(users: Registration[] = []) {
    this._users = users.map((user) => user.clone())
  }

  pseudoExists(pseudo: string): Promise<boolean> {
    return Promise.resolve(this._users.some((user) => user.pseudo.value() === pseudo))
  }

  async save(user: Registration) {
    this._users.push(user)
  }

  emailExists(email: string): Promise<boolean> {
    return Promise.resolve(this._users.some((user) => user.email.value() === email))
  }

  count() {
    return this._users.length
  }

  findByEmail(email: string): Promise<Maybe<Registration>> {
    return Promise.resolve(
      tryFind<Registration>((user) => user.email.value() === email)(this._users)
    )
  }
}

export { InMemoryRegistrationGateway }
