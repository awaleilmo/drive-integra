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
const UploadsController = () => import('#controllers/uploads_controller')
const StartController = () => import('#controllers/stars_controller')
import { middleware } from '#start/kernel'
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
        router.get('/', [FoldersController, 'folderView'])
        router.post('/add', [FoldersController, 'addFolder'])
        router.post('/rename/:id', [FoldersController, 'renameFolder'])
        router.delete('/delete/:id', [FoldersController, 'deleteFolder'])
        router.post('/recovery/:id', [FoldersController, 'recoveryFolder'])
        router.post('/openedAt/:id', [FoldersController, 'openedAt'])
        router.get('/getById/:id', [FoldersController, 'getById'])
      })
      .prefix('/folder')
      .use(middleware.auth())

    router
      .group(() => {
        router.get('/', [UploadsController, 'fileView'])
        router.post('/', [UploadsController, 'store'])
        router.post('/count', [UploadsController, 'countArrayExist'])
        router.get('/download/:id', [UploadsController, 'downloadFile'])
        router.post('/rename/:id', [UploadsController, 'renameFile'])
        router.delete('/delete/:id', [UploadsController, 'deleteFile'])
        router.post('/recovery/:id', [UploadsController, 'recoveryFile'])
        router.post('/openedAt/:id', [UploadsController, 'openedAt'])
        router.get('/getById/:id', [UploadsController, 'getById'])
      })
      .prefix('/uploads')
      .use(middleware.auth())

    router
      .group(() => {
        router.get('/start/file/:id', [StartController, 'toggleStarFile'])
        router.get('/start/folder/:id', [StartController, 'toggleStarFolder'])
      })
      .prefix('/start')
      .use(middleware.auth())

    router
      .group(() => {
        router.get('/', [HomeController, 'dataFolderAndFile'])
      })
      .prefix('/home')
      .use(middleware.auth())
  })
  .prefix('/api')
