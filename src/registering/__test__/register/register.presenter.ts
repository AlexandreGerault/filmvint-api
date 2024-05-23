import { RegisterPresenter } from '#core/registering/application/register'
import { Registration } from '#core/registering/domain/entities/registration/registration'
import { RegistrationError } from '#core/registering/domain/entities/registration/registration_exception'

export class RegisterTestPresenter extends RegisterPresenter {
  response: string = 'default'

  errors: RegistrationError[] = []

  user: Registration | null = null

  userRegistered(user: Registration): void {
    this.user = user
    this.response = 'User created'
  }

  validationFailed(errors: RegistrationError[]): void {
    this.response = 'Validation failed'
    this.errors = errors
  }
}
