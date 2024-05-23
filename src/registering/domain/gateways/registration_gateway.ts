import { Maybe } from 'pratica'
import { Registration } from '#core/registering/domain/entities/registration/registration'

export abstract class RegistrationGateway {
  abstract pseudoExists(pseudo: string): Promise<boolean>
  abstract emailExists(email: string): Promise<boolean>
  abstract findByEmail(email: string): Promise<Maybe<Registration>>
  abstract save(user: Registration): Promise<void>
}
