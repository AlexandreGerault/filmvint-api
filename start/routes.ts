/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import RegisterController from '#controllers/auth/register_controller'
import router from '@adonisjs/core/services/router'

router.post('register', [RegisterController, 'handle'])

router.get('/csrf', ({ response }) => {})

router.get('/me', async ({ response }) => {
  return response.send('Me')
})

router.post('login', async ({ request, response }) => {
  return response.send({ message: 'login' })
})
