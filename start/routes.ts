/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import UsersController from '#controllers/users_controller'
import { middleware } from '../start/kernel.js'
import router from '@adonisjs/core/services/router'
router.on('/').renderInertia('auth/login').use(middleware.guest())
router.post('/api/auth/login', [UsersController, 'login'])
router.on('/home').renderInertia('home').use(middleware.auth())

