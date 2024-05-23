import User from '#models/user'
import { ResponseStatus } from '@adonisjs/core/http'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

test.group('Register endpoint', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('register a new user', async ({ client, assert }) => {
    const inputs = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@doe.fr',
      password: 'P@ssw0rd!?',
      password_confirmation: 'P@ssw0rd!?',
    }

    const response = await client.post('/register').withCsrfToken().json(inputs).send()

    console.log(response.body())

    response.assertStatus(ResponseStatus.Created)

    assert.deepEqual(await User.findBy('email', 'john@doe.fr'), {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@doe.fr',
    })
  })
})
