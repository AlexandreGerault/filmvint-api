import { Register, RegisterPresenter } from '#core/registering/application/register'
import { Registration } from '#core/registering/domain/entities/registration/registration'
import { RegistrationError } from '#core/registering/domain/entities/registration/registration_exception'
import { createRegisterValidator as registerValidator } from '#validators/register_validator'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

class ApiRegisterPresenter implements RegisterPresenter {
  constructor(private _response: HttpContext['response']) {}

  validationFailed(errors: RegistrationError[]): void {
    this._response.badRequest(errors)
  }

  userRegistered(user: Registration): void {
    this._response.created(user.snapshot())
  }

  get response() {
    return this._response
  }
}

@inject()
export default class RegisterController {
  constructor(private register: Register) {}

  async handle({ request, response }: HttpContext) {
    const input = await registerValidator.validate(request.all())

    const presenter = new ApiRegisterPresenter(response)

    await this.register.execute(input, presenter)

    return presenter.response
  }
}
