import { randomUUID } from 'node:crypto'

export class EmailValidationToken {
  private token: string

  constructor(token: string) {
    this.token = token
  }

  static generate(): EmailValidationToken {
    return new EmailValidationToken(randomUUID())
  }

  static of(token: string): EmailValidationToken {
    return new EmailValidationToken(token)
  }

  value(): string {
    return this.token
  }
}
