import { ValidateEmailPresenter } from '#core/registering/application/validate_email'

export class ValidateEmailTestPresenter implements ValidateEmailPresenter {
  private response: 'EMAIL_VALIDATED' | 'INVALID_TOKEN' | null = null

  tokenInvalid(): void {
    this.response = 'INVALID_TOKEN'
  }

  emailValidated(): void {
    this.response = 'EMAIL_VALIDATED'
  }

  getResponse() {
    return this.response
  }
}
