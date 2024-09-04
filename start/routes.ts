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
const FoldersController = () => import('#controllers/folders_controller')
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

    router
      .group(() => {
        router.post('/add', [FoldersController, 'addFolder'])
      })
      .prefix('/folder')
      .use(middleware.auth())

    router
      .group(() => {
        router.get('/', [HomeController, 'dataFolderAndFile'])
      })
      .prefix('/home')
      .use(middleware.auth())
  })
  .prefix('/api')
