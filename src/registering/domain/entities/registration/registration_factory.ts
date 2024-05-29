import { Registration } from '#core/registering/domain/entities/registration/registration'
import {
  RegistrationException,
  RegistrationError,
} from '#core/registering/domain/entities/registration/registration_exception'
import { Email } from '#core/registering/domain/entities/registration/value_objects/email'
import { EmailValidationToken } from '#core/registering/domain/entities/registration/value_objects/email_validation_token'
import { PlainPassword } from '#core/registering/domain/entities/registration/value_objects/password'
import { Pseudo } from '#core/registering/domain/entities/registration/value_objects/pseudo'
import { PasswordHasher } from '#core/registering/domain/gateways/password_hasher'
import { RegistrationGateway } from '#core/registering/domain/gateways/registration_gateway'
import { TrashEmailGateway } from '#core/registering/domain/gateways/trash_email_gateway'
import { Result, Err } from 'pratica'

export class RegistrationFactory {
  constructor(
    private readonly _passwordHasher: PasswordHasher,
    private readonly trashEmail: TrashEmailGateway,
    private readonly userGateway: RegistrationGateway
  ) {}

  async create(
    email: string,
    pseudo: string,
    password: string,
    emailValidationToken?: EmailValidationToken
  ): Promise<Result<Registration, RegistrationException>> {
    const errors = [] as RegistrationError[]

    // if (await this.userGateway.emailExists(email)) {
    //   errors.push({ code: 'EMAIL_ALREADY_IN_USE' })
    // }

    if (await this.userGateway.pseudoExists(pseudo)) {
      errors.push({ code: 'PSEUDO_ALREADY_IN_USE' })
    }

    if (await this.trashEmail.isTrash(email)) {
      errors.push({ code: 'EMAIL_IS_TRASH' })
    }

    if (errors.length > 0) {
      return Err(new RegistrationException('REGISTRATION_FAILED', errors))
    }

    const hashedPassword = await this._passwordHasher.hash(new PlainPassword(password))

    return Registration.create(
      new Email(email),
      new Pseudo(pseudo),
      hashedPassword,
      emailValidationToken ?? EmailValidationToken.generate()
    )
  }
}
