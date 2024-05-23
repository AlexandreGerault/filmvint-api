import { RegistrationException } from '#core/registering/domain/entities/registration/registration_exception'

import { Email } from '#core/registering/domain/entities/registration/value_objects/email'
import { Pseudo } from '#core/registering/domain/entities/registration/value_objects/pseudo'
import { RegistrationCreated } from '#core/registering/domain/entities/registration/events/user_registered'
import { HashedPassword } from '#core/registering/domain/entities/registration/value_objects/password'
import { AggregateRoot } from '#core/aggregate_root'
import { RegistrationBlocked } from '#core/registering/domain/entities/registration/events/user_blocked'

import { randomUUID } from 'node:crypto'
import { EmailValidationToken } from '#core/registering/domain/entities/registration/value_objects/email_validation_token'
import { EmailValidated } from '#core/registering/domain/entities/registration/events/email_validated'
import { encaseRes, Result, Ok, Err } from 'pratica'

interface RegistrationSnapshot {
  id: string
  email: string
  pseudo: string
  password: string
  blocked: boolean
  isValidated: boolean
}

export class RegistrationId {
  readonly value: string

  constructor(value: string) {
    this.value = value
  }

  static create(value: string): RegistrationId {
    return new RegistrationId(value)
  }

  static generate(): RegistrationId {
    return new RegistrationId(randomUUID())
  }

  static of(uuid: string): RegistrationId {
    return new RegistrationId(uuid)
  }
}

export class Registration extends AggregateRoot<RegistrationId> {
  readonly email: Email
  readonly pseudo: Pseudo
  readonly password: HashedPassword

  private _emailValidated: boolean
  private _isBlocked: boolean
  private _emailValidationToken: EmailValidationToken

  constructor(
    userId: RegistrationId,
    email: Email,
    pseudo: Pseudo,
    password: HashedPassword,
    isBlocked: boolean,
    emailValidated: boolean,
    emailValidationToken: EmailValidationToken
  ) {
    super(userId)
    this.email = email
    this.pseudo = pseudo
    this.password = password
    this._isBlocked = isBlocked
    this._emailValidated = emailValidated
    this._emailValidationToken = emailValidationToken
  }

  static create(
    email: Email,
    pseudo: Pseudo,
    password: HashedPassword,
    emailValidationToken: EmailValidationToken
  ): Result<Registration, RegistrationException> {
    return encaseRes<Registration, RegistrationException>(
      () =>
        new Registration(
          RegistrationId.generate(),
          email,
          pseudo,
          password,
          false,
          false,
          emailValidationToken
        )
    ).map((user) => {
      user.emit(new RegistrationCreated(user.id))

      return user
    })
  }

  block() {
    this._isBlocked = true

    this.emit(new RegistrationBlocked(this.id))
  }

  validateEmail(
    emailValidationToken: EmailValidationToken
  ): Result<Registration, RegistrationException> {
    if (emailValidationToken.value() !== this._emailValidationToken.value()) {
      const tokenError = new RegistrationException('INVALID_EMAIL_VALIDATION_TOKEN', [
        { code: 'INVALID_EMAIL_VALIDATION_TOKEN' },
      ])

      return Err(tokenError)
    }

    this._emailValidated = true
    this.emit(new EmailValidated(this.id))

    return Ok(this)
  }

  isEmailValidated(): boolean {
    return this._emailValidated
  }

  snapshot(): RegistrationSnapshot {
    return {
      id: this.id.value,
      email: this.email.value(),
      pseudo: this.pseudo.value(),
      password: this.password.value(),
      blocked: this._isBlocked,
      isValidated: this._emailValidated,
    }
  }

  clone() {
    return new Registration(
      new RegistrationId(this.id.value),
      new Email(this.email.value()),
      new Pseudo(this.pseudo.value()),
      new HashedPassword(this.password.value()),
      this._isBlocked,
      this._emailValidated,
      new EmailValidationToken(this._emailValidationToken.value())
    )
  }
}
