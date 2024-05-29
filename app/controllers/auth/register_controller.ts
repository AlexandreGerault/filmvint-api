import { Register, RegisterPresenter } from '#core/registering/application/register'
import { Registration } from '#core/registering/domain/entities/registration/registration'
import { RegistrationError } from '#core/registering/domain/entities/registration/registration_exception'
import { createRegisterValidator as registerValidator } from '#validators/register_validator'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'

class ApiRegisterPresenter implements RegisterPresenter {
  constructor(private response: HttpContext['response']) {}

  validationFailed(errors: RegistrationError[]): void {
    console.log('validationFailed', {errors})
    this.response.badRequest(errors)
  }

  userRegistered(user: Registration): void {
    this.response.created(user.snapshot())
  }
}

@inject()
export default class RegisterController {
  constructor(private register: Register) {}

  async handle({ request, response }: HttpContext) {
    const input = await registerValidator.validate(request.all())

    const presenter = new ApiRegisterPresenter(response)

    this.register.execute(input, presenter)
  }
}
