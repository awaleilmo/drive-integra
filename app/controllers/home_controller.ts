import Folder from '#models/folder'
import Upload from '#models/upload'
import type { HttpContext } from '@adonisjs/core/http'

export default class HomeController {
  async home(ctx: HttpContext) {
    const userId = ctx.auth.user?.id || 0
    const folderId = ctx.request.input('folderId', null)
    const folderData = await Folder.query()
      .where('user_id', userId)
      .where('parentId', folderId)
      .withCount('uploads')
      .preload('uploads')
    const fileData = await Upload.query().where('user_id', userId).where('folderId', folderId)
    return ctx.inertia.render('home', {
      auth: ctx.auth.user,
      folder: () => folderData,
      file: () => fileData,
    })
  }
  async shared(ctx: HttpContext) {
    return ctx.inertia.render('shared', { auth: ctx.auth.user })
  }
  async starry(ctx: HttpContext) {
    return ctx.inertia.render('starry', { auth: ctx.auth.user })
  }
  async latest(ctx: HttpContext) {
    return ctx.inertia.render('latest', { auth: ctx.auth.user })
  }
  async trash(ctx: HttpContext) {
    return ctx.inertia.render('trash', { auth: ctx.auth.user })
  }

  async dataFolderAndFile(ctx: HttpContext) {
    try {
      const userId = ctx.auth.user?.id || 0
      const folderData = await Folder.query().where('user_id', userId).withCount('uploads')
      const fileData = await Upload.query().where('user_id', userId)
      return ctx.response.json({
        status: true,
        message: 'Data Folder and File',
        data: {
          folder: folderData,
          file: fileData,
        },
      })
    } catch (error) {
      ctx.response.json({
        status: false,
        message: error.message,
      })
    }
  }
}
