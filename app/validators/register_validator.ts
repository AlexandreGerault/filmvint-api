import vine from '@vinejs/vine'

export const createRegisterValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    pseudo: vine.string(),
    password: vine.string().confirmed({
      confirmationField: 'password_confirmation'
    })
  })
)