import { Registration } from '#core/registering/domain/entities/registration/registration'
import { RegistrationGateway } from '#core/registering/domain/gateways/registration_gateway'
import { Maybe } from 'pratica'

export class LucidRegistrationGateway implements RegistrationGateway {
  pseudoExists(_: string): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  emailExists(_: string): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  findByEmail(_: string): Promise<Maybe<Registration>> {
    throw new Error('Method not implemented.')
  }

  save(_: Registration): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
