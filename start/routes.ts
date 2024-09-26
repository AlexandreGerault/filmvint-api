/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const RegisterController = () => import('#authentication/register/register_controller')
const ValidateEmailController = () => import("#authentication/validate_email/validate_email_controller")

router.post('register', [RegisterController]).as('register')
router.get('validate-email/:email', [ValidateEmailController]).as('validate_email')
