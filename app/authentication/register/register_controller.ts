import { registerValidator } from '#authentication/register/register_validator'
import VerifyEmailMail from '#authentication/send_validation_mail/verify_email_mail'
import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
import { randomUUID } from 'crypto'
import mail from '@adonisjs/mail/services/main'

export default class RegisterController {
  async handle({ request, response }: HttpContext) {
    const payload = await request.validateUsing(registerValidator)

    const user = await User.create({ ...payload, id: randomUUID() })

    const verifyEmail = new VerifyEmailMail(user)

    mail.send(verifyEmail)

    return response.created(user)
  }
}
