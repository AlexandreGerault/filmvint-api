import factory from '@adonisjs/lucid/factories'
import User from '#models/user'

export const UserFactory = factory
  .define(User, async ({ faker }) => {
    return {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      pseudo: faker.internet.userName()
    }
  })
  .build()