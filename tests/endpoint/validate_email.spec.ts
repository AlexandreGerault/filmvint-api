import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import { UserFactory } from '#database/factories/user_factory'
import { ResponseStatus } from '@adonisjs/core/http'
import router from '@adonisjs/core/services/router'
import User from '#models/user'

test.group('Validate email', (group) => {
  group.each.setup(() => testUtils.db().truncate())

  test('it validates an email address successfully', async ({ client, assert }) => {
    const existingUser = await UserFactory.merge({ email: 'john.doe@example.com' }).create()
    
    const url = router.makeSignedUrl('validate_email', { email: existingUser.email })

    const response = await client.get(url).send()

    response.assertStatus(ResponseStatus.NoContent)

    const user = await User.findBy('email', existingUser.email)

    assert.isNotNull(user)
    assert.isNotNull(user?.emailVerifiedAt)
  })

  test('it does not validate a user with an invalid route', async ({ client, assert }) => {
    const existingUser = await UserFactory.merge({ email: 'john.doe@example.com' }).create()

    const url = router.makeUrl('validate_email', { email: existingUser.email })

    const response = await client.get(url).send()

    response.assertStatus(ResponseStatus.BadRequest)

    const user = await User.findBy('email', existingUser.email)

    assert.isNotNull(user)
    assert.isNull(user?.emailVerifiedAt)
  })


  test('it handles an invalid email address', async ({ client, assert }) => {
    const existingUser = await UserFactory.merge({ email: 'john.doe@example.com' }).create()
    
    const url = router.makeSignedUrl('validate_email', { email: 'john.doe@example.fr' })

    const response = await client.get(url).send()

    response.assertStatus(ResponseStatus.NotFound);

    const user = await User.findBy('email', existingUser.email)

    assert.isNotNull(user)
    assert.isNull(user?.emailVerifiedAt)
  })
})
