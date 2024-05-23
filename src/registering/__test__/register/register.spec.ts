import { registerSUT } from '#core/registering/__test__/register/register.sut'
import { RegistrationCreated } from '#core/registering/domain/entities/registration/events/user_registered'
import { test } from '@japa/runner'

test.group('registering / Register', () => {
  test('it registers a user', async ({ assert }) => {
    const { registerUser, registrationGateway, getResponse, getEvents } = registerSUT().build()

    await registerUser({
      email: 'email@core.com',
      password: 'Password_0!',
      pseudo: 'pseudo',
    })

    assert.equal(registrationGateway.count(), 1)
    assert.equal(getResponse(), 'User created')
    assert.lengthOf(getEvents(), 1)
    assert.instanceOf(getEvents()[0], RegistrationCreated)
  })

  test('it cannot register a user with an existing email', async ({ assert }) => {
    const { registerUser, registrationGateway, getResponse } = registerSUT()
      .withExistingEmail('already@used.com')
      .build()

    await registerUser({
      email: 'already@used.com',
      password: 'Password_0!',
      pseudo: 'pseudo',
    })

    assert.equal(registrationGateway.count(), 1)
    assert.equal(getResponse(), 'Validation failed')
  })

  test('it cannot register a user with an existing pseudo', async ({ assert }) => {
    const { registerUser, registrationGateway, getResponse } = registerSUT()
      .withExistingPseudo('already-used')
      .build()

    await registerUser({
      email: 'new-email@example.com',
      password: 'Password_0!',
      pseudo: 'already-used',
    })

    assert.equal(registrationGateway.count(), 1)
    assert.equal(getResponse(), 'Validation failed')
  })

  test('it refuses trash emails', async ({ assert }) => {
    const { registerUser, registrationGateway, getResponse } = registerSUT()
      .considerEmailIsTrash()
      .build()

    await registerUser({
      email: 'new-email@example.com',
      password: 'Password_0!',
      pseudo: 'already-used',
    })

    assert.equal(registrationGateway.count(), 0)
    assert.equal(getResponse(), 'Validation failed')
  })
})
