import type { HttpContext } from '@adonisjs/core/http'
import { addFolder, renameFolder, moveFolder } from '#validators/folder'
import { decrypt } from '#services/encryption_service'
import Folder from '#models/folder'
import fs from 'node:fs'
import path from 'node:path'
import app from '@adonisjs/core/services/app'
import { DateTime } from 'luxon'

export default class FoldersController {
  async addFolder(ctx: HttpContext) {
    try {
      const user = ctx.auth.user!
      const userId = user?.id || 0
      let parentId = ctx.request.input('parentId', null)
      const checkParent = await Folder.find(parentId)
      if (!checkParent) {
        parentId = null
      }
      const payload = await addFolder.validate(ctx.request.all())
      let folderPath = `uploads/${user.randomString}`
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
          statusCode: 201,
          status: true,
          message: 'Folder ditambahkan',
        })
      }
      return ctx.response.json({
        statusCode: 400,
        status: false,
        message: 'Folder sudah ada',
      })
    } catch (error) {
      ctx.response.json({
        statusCode: 500,
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
          statusCode: 404,
          status: false,
          message: 'Folder tidak ditemukan',
        })
      }
      check.folderName = payload.name?.trim() || ''
      check.updatedBy = user.id
      await check.save()
      return ctx.response.json({
        statusCode: 200,
        status: true,
        message: 'Folder berhasil diubah',
      })
    } catch (error) {
      ctx.response.json({
        statusCode: 500,
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
          statusCode: 404,
          status: false,
          message: 'Folder tidak ditemukan',
        })
      }
      const check = await Folder.findOrFail(folderId)
      if (!check) {
        return ctx.response.json({
          statusCode: 404,
          status: false,
          message: 'Folder tidak ditemukan',
        })
      }

      await this.moveFolderToTrash(check)

      return ctx.response.json({
        statusCode: 200,
        status: true,
        message: 'Folder berhasil dihapus',
      })
    } catch (error) {
      ctx.response.json({
        statusCode: 500,
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
          statusCode: 404,
          status: false,
          message: 'Folder tidak ditemukan',
        })
      }
      const check = await Folder.findOrFail(folderId)
      if (!check) {
        return ctx.response.json({
          statusCode: 404,
          status: false,
          message: 'Folder tidak ditemukan',
        })
      }
      await this.recoveryAllFolder(check)
      return ctx.response.json({
        statusCode: 200,
        status: true,
        message: 'Folder berhasil dikembalikan',
      })
    } catch (error) {
      ctx.response.json({
        statusCode: 500,
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
          statusCode: 404,
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
        statusCode: 200,
        status: true,
        message: 'Folder ditemukan',
        data: fileData,
      })
    } catch (error) {
      ctx.response.json({
        statusCode: 500,
        status: false,
        message: error.message,
        data: [],
      })
    }
  }

  async openedAt(ctx: HttpContext) {
    try {
      const user = ctx.auth.user!
      const fileId = ctx.params.id
      if (!fileId) {
        return ctx.response.json({
          statusCode: 404,
          status: false,
          message: 'File tidak ditemukan',
        })
      }
      const check = await Folder.query().where('id', fileId).first()
      if (!check) {
        return ctx.response.json({
          statusCode: 404,
          status: false,
          message: 'File tidak ditemukan',
        })
      }
      check.openedBy = user.id
      check.openedAt = DateTime.now()
      await check.save()
      return ctx.response.json({
        statusCode: 200,
        status: true,
        message: 'File berhasil dibuka',
      })
    } catch (error) {
      ctx.response.json({
        statusCode: 500,
        status: false,
        message: error.message,
      })
    }
  }

  async getById(ctx: HttpContext) {
    try {
      const folderId = ctx.params.id
      const check = await Folder.query()
        .preload('user')
        .preload('parent')
        .preload('openedByUser')
        .preload('updatedByUser')
        .preload('createdByUser')
        .where('id', folderId)
        .first()
      if (!check) {
        return ctx.response.json({
          statusCode: 404,
          status: false,
          message: 'Folder tidak ditemukan',
          data: [],
        })
      }
      return ctx.response.json({
        statusCode: 200,
        status: true,
        message: 'Folder ditemukan',
        data: check,
      })
    } catch (error) {
      return ctx.response.json({
        statusCode: 500,
        status: false,
        message: error.message,
        data: [],
      })
    }
  }

  async moveFolder(ctx: HttpContext) {
    try {
      const user = ctx.auth.user!
      const payload = await moveFolder.validate(ctx.request.all())
      const check = await Folder.query().where('id', payload.id).where('user_id', user.id).first()
      if (!check) {
        return ctx.response.json({
          statusCode: 404,
          status: false,
          message: 'Folder tidak ditemukan',
        })
      }

      await this.moveFolderToAnotherFolder(check, payload.targetId)

      return ctx.response.json({
        statusCode: 200,
        status: true,
        message: 'Folder berhasil dipindahkan',
      })
    } catch (error) {
      ctx.response.json({
        statusCode: 500,
        status: false,
        message: error.message,
      })
    }
  }

  async moveFolderToAnotherFolder(folder: Folder, parentId: number | null) {
    folder.parentId = parentId
    await folder.save()

    const files = await folder.related('uploads').query()
    for (const file of files) {
      file.folderId = parentId
      await file.save()
    }

    const subfolders = await folder.related('folders').query()
    for (const subfolder of subfolders) {
      await this.moveFolderToAnotherFolder(subfolder, parentId) // Recursive call
    }
  }
}
