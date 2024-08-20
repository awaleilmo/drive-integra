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

// Inertia Render Routes
router.group(() => {
  // Guest Routes
  router
    .group(() => {
      router.on('/').renderInertia('auth/login')
    })
    .use(middleware.guest())

  // Auth Routes
  router
    .group(() => {
      router.on('/home').renderInertia('home')
    })
    .use(middleware.auth())
})

// API Routes
router
  .group(() => {
    router
      .group(() => {
        router.post('/auth/login', [UsersController, 'login']).use(middleware.guest())
      })
      .prefix('/users')
  })
  .prefix('/api')
