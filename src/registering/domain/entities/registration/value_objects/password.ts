import { z } from 'zod'

export class HashedPassword {
  private password: string

  constructor(password: string) {
    this.password = password
  }

  value(): string {
    return this.password
  }
}

export class PlainPassword {
  private password: string = ''

  constructor(password: string) {
    this.password = z
      .string()
      .regex(
        /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/,
        'PASSWORD_INVALID_CHARACTERS'
      )
      .parse(password)
  }

  value(): string {
    return this.password
  }
}
