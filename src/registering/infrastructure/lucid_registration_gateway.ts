import { Registration } from '#core/registering/domain/entities/registration/registration'
import { RegistrationGateway } from '#core/registering/domain/gateways/registration_gateway'
import User from '#models/user'
import { Maybe } from 'pratica'

export class LucidRegistrationGateway implements RegistrationGateway {
  pseudoExists(pseudo: string): Promise<boolean> {
    return User.query().where('pseudo', pseudo).first().then((user) => user !== null)
  }

  emailExists(email: string): Promise<boolean> {
    return User.query().where('email', email).first().then((user) => user !== null)
  }

  findByEmail(_: string): Promise<Maybe<Registration>> {
    throw new Error('Method not implemented.')
  }

  async save(registration: Registration): Promise<void> {
    const snapshot = registration.snapshot()
    const userAlreadyExist = await this.emailExists(snapshot.email)

    if (!userAlreadyExist) {
      console.log("Creating new user")
      
      await User.create({
        id: snapshot.id,
        email: snapshot.email,
        pseudo: snapshot.pseudo,
        password: snapshot.password,
      })

      return
    }

    console.log('Saving user', {userAlreadyExist})
  }
}
