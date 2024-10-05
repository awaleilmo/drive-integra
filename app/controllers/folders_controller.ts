import type { HttpContext } from '@adonisjs/core/http'
import { addFolder, renameFolder } from '#validators/folder'
import { decrypt } from '#services/encryption_service'
import Folder from '#models/folder'
import fs from 'node:fs'
import path from 'node:path'
import app from '@adonisjs/core/services/app'
import { DateTime } from 'luxon'

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
      const payload = await renameFolder.validate(ctx.request.all())
      const check = await Folder.query().where('id', folderId).where('user_id', user.id).first()
      if (!check) {
        return ctx.response.json({
          status: false,
          message: 'Folder tidak ditemukan',
        })
      }
      check.folderName = payload.name?.trim() || ''
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

  async deleteFolder(ctx: HttpContext) {
    try {
      const folderId = ctx.params.id
      if (!folderId) {
        return ctx.response.json({
          status: false,
          message: 'Folder tidak ditemukan',
        })
      }
      const check = await Folder.findOrFail(folderId)
      if (!check) {
        return ctx.response.json({
          status: false,
          message: 'Folder tidak ditemukan',
        })
      }

      await this.moveFolderToTrash(check)

      return ctx.response.json({
        status: true,
        message: 'Folder berhasil dihapus',
      })
    } catch (error) {
      ctx.response.json({
        status: false,
        message: error.message,
      })
    }
  }

  async moveFolderToTrash(folder: Folder) {
    // Set `deleted_at` for the folder itself
    folder.deletedAt = DateTime.now()
    await folder.save()

    // Get and move all files in the folder to trash
    const files = await folder.related('uploads').query()
    for (const file of files) {
      file.deletedAt = DateTime.now()
      await file.save()
    }

    // Get all subfolders and move them and their contents to trash
    const subfolders = await folder.related('folders').query()
    for (const subfolder of subfolders) {
      await this.moveFolderToTrash(subfolder) // Recursive call
    }
  }

  async recoveryFolder(ctx: HttpContext) {
    try {
      const folderId = ctx.params.id
      if (!folderId) {
        return ctx.response.json({
          status: false,
          message: 'Folder tidak ditemukan',
        })
      }
      const check = await Folder.findOrFail(folderId)
      if (!check) {
        return ctx.response.json({
          status: false,
          message: 'Folder tidak ditemukan',
        })
      }
      await this.recoveryAllFolder(check)
      return ctx.response.json({
        status: true,
        message: 'Folder berhasil dikembalikan',
      })
    } catch (error) {
      ctx.response.json({
        status: false,
        message: error.message,
      })
    }
  }

  async recoveryAllFolder(folder: Folder) {
    // Set `deleted_at` for the folder itself
    folder.deletedAt = null
    await folder.save()

    // Get and move all files in the folder to trash
    const files = await folder.related('uploads').query()
    for (const file of files) {
      file.deletedAt = null
      await file.save()
    }

    // Get all subfolders and move them and their contents to trash
    const subfolders = await folder.related('folders').query()
    for (const subfolder of subfolders) {
      await this.recoveryAllFolder(subfolder) // Recursive call
    }
  }

  async folderView(ctx: HttpContext) {
    try {
      const userId = ctx.auth.user?.id || 0
      let folderId = ctx.request.input('folders', null)
      if (folderId === 'null') {
        folderId = null
      }
      let isTrashView = ctx.request.input('isTrashView', 'false') === 'true'
      let decryptId = ''
      if (folderId !== null) {
        decryptId = decrypt(folderId)
        const splitDec = decryptId.split(':')
        folderId = Number.parseInt(splitDec[1])
      }
      const check = await Folder.query()
        .where('parent_id', folderId)
        .where('user_id', userId)
        .first()
      if (!check) {
        return ctx.response.json({
          status: false,
          message: 'Folder tidak ditemukan',
          data: [],
        })
      }
      let fileData: any = Folder.query()
        .where('user_id', userId)
        .preload('user')
        .preload('parent')
        .preload('openedByUser')
        .preload('updatedByUser')
        .preload('createdByUser')
      if (isTrashView) {
        fileData = await fileData.whereNotNull('deleted_at')
      } else {
        fileData = await fileData.where('parent_id', folderId).whereNull('deleted_at')
      }
      return ctx.response.json({
        status: true,
        message: 'Folder ditemukan',
        data: fileData,
      })
    } catch (error) {
      ctx.response.json({
        status: false,
        message: error.message,
        data: [],
      })
    }
  }
}
