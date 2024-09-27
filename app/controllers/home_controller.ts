import Folder from '#models/folder'
import Upload from '#models/upload'
import type { HttpContext } from '@adonisjs/core/http'
import BreadcrumbsService from '#services/breadcrumb_service'
import { decrypt } from '#services/encryption_service'

export default class HomeController {
  async home(ctx: HttpContext) {
    const userId = ctx.auth.user?.id || 0
    let folderId = ctx.request.input('folders', null)
    let decryptId = ''
    if (folderId !== null) {
      decryptId = decrypt(folderId)
      const splitDec = decryptId.split(':')
      folderId = Number.parseInt(splitDec[1])
    }
    const checkFolder = await Folder.find(folderId)
    if (!checkFolder) {
      folderId = null
    }
    const breadcrumbs = await BreadcrumbsService.getBreadcrumbs(folderId)
    const folderData = await Folder.query()
      .where('user_id', userId)
      .where('parentId', folderId)
      .whereNull('deleted_at')
      .withCount('uploads')
      .preload('uploads')
    const fileData = await Upload.query()
      .where('user_id', userId)
      .where('folderId', folderId)
      .whereNull('deleted_at')
    return ctx.inertia.render('home', {
      auth: ctx.auth.user,
      folder: () => folderData,
      file: () => fileData,
      breadcrumbs: () => breadcrumbs,
    })
  }
  async shared(ctx: HttpContext) {
    return ctx.inertia.render('shared', { auth: ctx.auth.user })
  }
  async starry(ctx: HttpContext) {
    const user = ctx.auth.user!
    const starredFiles = await Upload.query().where('userId', user.id).where('is_starred', true)
    const starredFolders = await Folder.query().where('userId', user.id).where('is_starred', true)
    return ctx.inertia.render('starry', {
      auth: ctx.auth.user,
      folder: starredFolders,
      file: starredFiles,
    })
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
