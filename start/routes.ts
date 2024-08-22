/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
const UsersController = () => import('#controllers/users_controller')
const HomeController = () => import('#controllers/home_controller')
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
      router.get('/home', [HomeController, 'home'])
      router.get('/shared', [HomeController, 'shared'])
      router.get('/latest', [HomeController, 'latest'])
      router.get('/starry', [HomeController, 'starry'])
      router.get('/trash', [HomeController, 'trash'])
      router.post('/logout', [UsersController, 'logout'])
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
