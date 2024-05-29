import { RegistrationFactory } from '#core/registering/domain/entities/registration/registration_factory'
import { EmailValidationToken } from '#core/registering/domain/entities/registration/value_objects/email_validation_token'
import { RegistrationGateway } from '#core/registering/domain/gateways/registration_gateway'
import { UserFactory } from '#database/factories/user_factory'
import User from '#models/user'
import app from '@adonisjs/core/services/app'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('Lucid registration gateway', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('check if email already exists', async ({ assert }) => {
    await UserFactory.merge({ email: 'john@doe.fr' }).create()
    const repository = await app.container.make(RegistrationGateway)

    assert.isTrue(await repository.emailExists('john@doe.fr'))
    assert.isFalse(await repository.emailExists('john@doe.de'))
  })

  test('check if the pseudo already exists', async ({ assert }) => {
    await UserFactory.merge({ pseudo: 'john' }).create()
    const repository = await app.container.make(RegistrationGateway)

    assert.isTrue(await repository.pseudoExists('john'))
    assert.isFalse(await repository.pseudoExists('doe'))
  })

  test('save a registration', async ({ assert }) => {
    const repository = await app.container.make(RegistrationGateway)

    const registrationFactory = await app.container.make(RegistrationFactory)

    const registration = await registrationFactory.create('john@doe.fr', 'john', 'P@ssword0?!', EmailValidationToken.of('123'))

    registration.cata({
      Ok: async (_registration) => {
        await repository.save(_registration)
      },
      Err: (_) => {
        assert.fail('Registration should be valid')
      }
    })

    const user = await User.query().first()
    assert.isNotNull(user)
  })
})
