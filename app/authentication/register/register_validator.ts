import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    email: vine.string().email().unique(async (db, value, field) => {
      return await db.from('users').where(field.name.toString(), value).first() === null
    }),
    firstName: vine.string(),
    lastName: vine.string(),
    password: vine.string().confirmed({
      confirmationField: 'password_confirmation',
    }),
  })
)
