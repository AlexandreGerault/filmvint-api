import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column()
  declare email: string

  @column({ columnName: 'email_verified_at' })
  declare emailVerifiedAt: DateTime | null

  @column({ columnName: 'first_name' })
  declare firstName: string | null

  @column({ isPrimary: true })
  declare id: string

  @column({ columnName: 'last_name' })
  declare lastName: string | null

  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
