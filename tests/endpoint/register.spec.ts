import { UserFactory } from '#database/factories/user_factory'
import User from '#models/user'
import { ResponseStatus } from '@adonisjs/core/http'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import mail from '@adonisjs/mail/services/main'
import VerifyEmailMail from '#authentication/send_validation_mail/verify_email_mail'

test.group('Register endpoint', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('register a new user successfully', async ({ client, assert }) => {
    /**
     * Turn on the fake mode
     */
    const { mails } = mail.fake()

    const inputs = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@doe.fr',
      password: 'P@ssw0rd!?',
      password_confirmation: 'P@ssw0rd!?',
    }

    const response = await client.post('/register').json(inputs).withCsrfToken().send()

    response.assertStatus(ResponseStatus.Created)

    const user = await User.findBy('email', 'john@doe.fr')

    assert.equal(user?.firstName, 'John')
    assert.equal(user?.lastName, 'Doe')
    assert.equal(user?.email, 'john@doe.fr')
    assert.equal(user?.email_verified_at, null)

    mails.assertSent(VerifyEmailMail, ({ message }) => {
      return message.hasTo('john@doe.fr') && message.hasSubject('Verify email address')
    })
  })

  test('trying to register a user with an invalid payload raises an unprocessable entity response', async ({
    client,
    assert,
  }) => {
    const inputs = {
      firstName: '',
      lastName: '',
      email: '',
      password: 'P@ssw0rd!?',
      password_confirmation: 'P@ssw0rd!?',
    }

    const response = await client.post('/register').json(inputs).withCsrfToken().send()

    response.assertStatus(ResponseStatus.UnprocessableEntity)
    response.assertBody({
      errors: [
        { message: 'The email field must be defined', field: 'email', rule: 'required' },
        { message: 'The firstName field must be defined', field: 'firstName', rule: 'required' },
        { message: 'The lastName field must be defined', field: 'lastName', rule: 'required' },
      ],
    })

    const user = await User.query().orderBy('created_at', 'desc').first()

    assert.isNull(user)
  })

  test("trying to register a user with an email that's already taken raises an unprocessable entity response", async ({
    client,
  }) => {
    const existingUser = await UserFactory.merge({ email: 'john.doe@example.com' }).create()

    const inputs = {
      firstName: 'John',
      lastName: 'Doe',
      email: existingUser.email,
      password: 'P@ssw0rd!?',
      password_confirmation: 'P@ssw0rd!?',
    }

    const response = await client.post('/register').json(inputs).withCsrfToken().send()

    response.assertStatus(ResponseStatus.UnprocessableEntity)
    response.assertBody({
      errors: [
        { message: 'The email has already been taken', field: 'email', rule: 'database.unique' },
      ],
    })
  })
})
