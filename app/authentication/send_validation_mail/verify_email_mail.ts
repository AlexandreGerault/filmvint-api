import { BaseMail } from '@adonisjs/mail'
import config from '@adonisjs/core/services/config'
import User from '#models/user'

export default class VerifyEmailMail extends BaseMail {
  subject = 'Verify email address'

  #user: User

  constructor(user: User) {
    super()
    this.#user = user
    this.from = config.get('mail.replyTo')
  }

  prepare(): void | Promise<void> {
    this.message.to(this.#user.email)

    this.message.htmlView('emails/verify_email_html', {})
    this.message.textView('emails/verify_email_text', {})
  }
}
