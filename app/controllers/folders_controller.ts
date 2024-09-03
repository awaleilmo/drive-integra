import type { HttpContext } from '@adonisjs/core/http'
import { addFolder } from '#validators/folder'
import Folder from '#models/folder'

export default class FoldersController {
  async addFolder(ctx: HttpContext) {
    try {
      const userId = ctx.auth.user?.id || 0
      const parentId = ctx.request.input('parentId', null)
      const payload = await addFolder.validate(ctx.request.all())
      const check = await Folder.findBy('folder_name', payload.folderName)
      if (!check) {
        const rest = new Folder()
        rest.userId = userId
        rest.parentId = parentId
        rest.folderName = payload.folderName
        rest.folderPath = payload.folderName
      }
      ctx.response.json({
        status: false,
        message: 'Folder sudah ada',
      })
    } catch (error) {
      ctx.response.json({
        status: false,
        message: error.message,
      })
    }
  }
}
