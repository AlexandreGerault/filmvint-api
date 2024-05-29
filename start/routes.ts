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

