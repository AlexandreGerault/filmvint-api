import type { HttpContext } from '@adonisjs/core/http'

export default class RegisterController {
  async handle({ request, response }: HttpContext) {
    return response.safeStatus(201).send({ message: 'Hello world' })
  }
}
