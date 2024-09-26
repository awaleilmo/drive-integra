import type { HttpContext } from '@adonisjs/core/http'
import { addFolder } from '#validators/folder'
import Folder from '#models/folder'
import fs from 'node:fs'
import path from 'node:path'
import app from '@adonisjs/core/services/app'

export default class FoldersController {
  async addFolder(ctx: HttpContext) {
    try {
      const userId = ctx.auth.user?.id || 0
      let parentId = ctx.request.input('parentId', null)
      const checkParent = await Folder.find(parentId)
      if (!checkParent) {
        parentId = null
      }
      const payload = await addFolder.validate(ctx.request.all())
      let folderPath = `uploads/${userId}`
      const check = Folder.query()
      check.where('folder_name', payload.folderName)
      if (parentId !== null) {
        const parentFolder = await Folder.findOrFail(parentId)
        folderPath = path.join(parentFolder.folderPath)
        check.where('parent_id', parentId)
      }
      folderPath = path.join(folderPath, payload.folderName)
      check.where('user_id', userId)
      const checkData = await check.first()
      if (!checkData) {
        fs.mkdirSync(app.publicPath(folderPath), { recursive: true })
        const rest = new Folder()
        rest.userId = userId
        rest.parentId = parentId
        rest.folderName = payload.folderName
        rest.folderPath = folderPath
        rest.createdBy = userId
        rest.updatedBy = userId
        await rest.save()
        return ctx.response.json({
          status: true,
          message: 'Folder ditambahkan',
        })
      }
      return ctx.response.json({
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

  async renameFolder(ctx: HttpContext) {
    try {
      const user = ctx.auth.user!
      const folderId = ctx.params.id
      if (!folderId) {
        return ctx.response.json({
          status: false,
          message: 'Folder tidak ditemukan',
        })
      }
      const payload = await addFolder.validate(ctx.request.all())
      const check = await Folder.query().where('id', folderId).where('user_id', user.id).first()
      if (!check) {
        return ctx.response.json({
          status: false,
          message: 'Folder tidak ditemukan',
        })
      }
      check.folderName = payload.folderName
      check.updatedBy = user.id
      await check.save()
      return ctx.response.json({
        status: true,
        message: 'Folder berhasil diubah',
      })
    } catch (error) {
      ctx.response.json({
        status: false,
        message: error.message,
      })
    }
  }
}
