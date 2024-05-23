export interface RegistrationError {
  code:
    | 'REGISTRATION_FAILED'
    | 'EMAIL_ALREADY_IN_USE'
    | 'PSEUDO_ALREADY_IN_USE'
    | 'EMAIL_IS_TRASH'
    | 'INVALID_USER'
    | 'INVALID_EMAIL_VALIDATION_TOKEN'
}

export class RegistrationException extends Error {
  readonly errors = [] as RegistrationError[]

  readonly message: string

  constructor(message: string, errors: RegistrationError[]) {
    super(message)
    this.message = message
    this.name = 'RegistrationException'
    this.errors = errors
  }
}
