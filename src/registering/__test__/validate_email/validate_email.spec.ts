import { makeRegistrationTestFactory } from '#core/registering/__test__/registration_test_factory'
import { validateEmailSUT } from '#core/registering/__test__/validate_email/validate_email.sut'
import { EmailValidated } from '#core/registering/domain/entities/registration/events/email_validated'
import { EmailValidationToken } from '#core/registering/domain/entities/registration/value_objects/email_validation_token'
import { test } from '@japa/runner'

test.group('registering / Validate email', () => {
  test('it validates the email', async ({ assert }) => {
    const registrationFactory = makeRegistrationTestFactory()

    const existingRegistration = await registrationFactory.createForEmail(
      'john@doe.fr',
      EmailValidationToken.of('token')
    )

    const { validateEmail, registrationGateway, getResponse, getEvents } = validateEmailSUT()
      .email('john@doe.fr')
      .token('token')
      .registrations([
        existingRegistration.cata({
          Ok: (registration) => registration,
          Err: (error) => {
            return assert.fail(error.errors.join(', '))
          },
        }),
      ])
      .build()

    await validateEmail()

    const registration = await registrationGateway.findByEmail('john@doe.fr')

    assert.equal(getResponse(), 'EMAIL_VALIDATED')
    assert.isTrue(registration.value()?.isEmailValidated())
    assert.lengthOf(getEvents(), 1)
    assert.instanceOf(getEvents()[0], EmailValidated)
  })

  test('it cannot validate the email when providing an incorrect token', async ({ assert }) => {
    const registrationFactory = makeRegistrationTestFactory()

    const exisingRegistration = await registrationFactory.createForEmail(
      'john@doe.fr',
      EmailValidationToken.of('token')
    )

    const { validateEmail, registrationGateway, getResponse } = validateEmailSUT()
      .email('john@doe.fr')
      .token('invalid-token')
      .registrations([
        exisingRegistration.cata({
          Ok: (registration) => registration,
          Err: (error) => {
            return assert.fail(error.errors.join(', '))
          },
        }),
      ])
      .build()

    await validateEmail()

    const registration = await registrationGateway.findByEmail('john@doe.fr')

    assert.isFalse(registration.value()?.isEmailValidated())
    assert.equal(getResponse(), 'INVALID_TOKEN')
  })
})
