import User from '#models/user'
import { ResponseStatus } from '@adonisjs/core/http'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('Register endpoint', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('register a new user', async ({ client, assert }) => {
    const inputs = {
      pseudo: 'JohnDoe',
      email: 'john@doe.fr',
      password: 'P@ssw0rd!?',
      password_confirmation: 'P@ssw0rd!?',
    }

    const response = await client.post('/register').json(inputs).withCsrfToken().send()

    response.assertStatus(ResponseStatus.Created)

    const user = await User.findBy('email', 'john@doe.fr')

    assert.equal(user?.pseudo, 'JohnDoe')
    assert.equal(user?.email, 'john@doe.fr')
  })
})
