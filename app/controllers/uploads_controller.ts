import Folder from '#models/folder'
import Upload from '#models/upload'
import { decrypt } from '#services/encryption_service'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import sharp from 'sharp'
import { renameUpload } from '#validators/upload'
import { DateTime } from 'luxon'

export default class UploadsController {
  async store(ctx: HttpContext) {
    try {
      const user = ctx.auth.user!
      // const payload = await addUpload.validate(ctx.request.all)

      const files = ctx.request.file('file')
      let folderId = ctx.request.input('folderId', null)
      let folderPath = `uploads/${user.id}`
      const replace = ctx.request.input('replace', false) as string
      const isDuplicate = ctx.request.input('isDuplicate', false) as boolean

      if (folderId && folderId !== 'null' && folderId !== '') {
        const decryptId = decrypt(ctx.request.input('folderId'))
        const splitDec = decryptId.split(':')
        folderId = Number.parseInt(splitDec[1])
        const checkFolder = await Folder.find(folderId)
        folderPath = checkFolder!.folderPath
      }

      const fileName = ctx.request.input('fileName', '')
      const fileRaw = Date.now() + files!.clientName
      const filePath = `${folderPath}/${fileRaw}`
      const thumbnailPath = `thumbnail/${user.id + 'sdf' + fileRaw}`

      try {
        await files!.move(app.publicPath(folderPath), {
          name: fileRaw,
          overwrite: true,
        })
      } catch (error) {
        return ctx.response.json({
          statusCode: 500,
          status: false,
          message: error.message,
        })
      }

      try {
        if (files!.type === 'image') {
          if (files!.extname === 'svg') {
            await sharp(app.publicPath(filePath)).toFile(thumbnailPath)
          } else {
            await sharp(app.publicPath(filePath))
              .resize(150, 150)
              .toFile(app.publicPath(thumbnailPath))
          }
        }
      } catch (error) {
        return ctx.response.json({
          statusCode: 500,
          status: false,
          message: error.message,
        })
      }

      if (isDuplicate) {
        if (replace === 'true') {
          await this.incrementVersion(folderId, files!.clientName, user.id)
        } else {
          await this.incrementSameFileCount(folderId, files!.clientName, user.id)
        }
      }

      await Upload.updateOrCreate(
        {
          fileName,
          userId: user.id,
          folderId: folderId && folderId !== 'null' && folderId !== '' ? folderId : null,
        }, // Jika folderId tidak null
        {
          fileSize: files!.size.toFixed(2),
          fileType: files!.type,
          filePath,
          fileExt: files!.extname,
          thumbnailPath: files!.type!.startsWith('image') ? thumbnailPath : null,
          description: ctx.request.input('description'),
          createdBy: user.id,
          updatedBy: user.id,
        }
      )

      return ctx.response.json({
        statusCode: 200,
        status: true,
        message: `File " ${fileName} " berhasil diupload`,
      })
    } catch (error) {
      ctx.response.json({
        statusCode: 500,
        status: false,
        message: error.message,
      })
    }
  }

  async countArrayExist(ctx: HttpContext) {
    try {
      const user = ctx.auth.user!
      const dataInput = ctx.request.input('data', null)
      const folderId = ctx.request.input('folderId', null)
      let count = 0
      let dataResult: any[] = []
      if (dataInput !== null) {
        for (const element of dataInput) {
          const check = await Upload.query()
            .where('file_name', element)
            .where('user_id', user.id)
            .where('folder_id', folderId)
            .first()
          if (check) {
            count++
            dataResult.push(check)
          }
        }
      }
      return ctx.response.json({
        status: true,
        message: 'Jumlah file',
        data: dataResult,
        count: count,
      })
    } catch (error) {
      ctx.response.json({
        status: false,
        message: error.message,
      })
    }
  }

  async incrementSameFileCount(folderId: number | null, fileName: string, userId: number) {
    try {
      // @ts-ignore
      const Folders = folderId && folderId !== 'null' && folderId !== '' ? folderId : null
      const check = await Upload.query()
        .where('file_name', fileName)
        .where('user_id', userId)
        .where('folder_id', Folders!)
        .first()
      check!.sameFileCount = check!.sameFileCount + 1
      await check!.save()
      return true
    } catch (error) {
      console.log(error)
    }
  }

  async incrementVersion(folderId: number | null, fileName: string, userId: number) {
    try {
      // @ts-ignore
      const Folders = folderId && folderId !== 'null' && folderId !== '' ? folderId : null
      const check = await Upload.query()
        .where('file_name', fileName)
        .where('user_id', userId)
        .where('folder_id', Folders!)
        .first()
      check!.version = check!.version + 1
      await check!.save()
      return true
    } catch (error) {
      console.log(error)
    }
  }

  async downloadFile(ctx: HttpContext) {
    const user = ctx.auth.user!
    const fileId = ctx.params.id
    if (!fileId) {
      return ctx.response.json({
        statusCode: 404,
        status: false,
        message: 'File tidak ditemukan',
      })
    }

    const check = await Upload.query().where('id', fileId).where('user_id', user.id).first()
    if (!check) {
      return ctx.response.json({
        statusCode: 404,
        status: false,
        message: 'File tidak ditemukan',
      })
    }
    const filePath = check.filePath
    const path = app.publicPath(filePath)
    return ctx.response.download(path)
  }

  async renameFile(ctx: HttpContext) {
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

      const payload = await renameUpload.validate(ctx.request.all())
      const check = await Upload.query().where('id', fileId).where('user_id', user.id).first()
      if (!check) {
        return ctx.response.json({
          statusCode: 404,
          status: false,
          message: 'File tidak ditemukan',
        })
      }
      check.fileName = payload.name?.trim() || ''
      check.updatedBy = user.id
      await check.save()
      return ctx.response.json({
        statusCode: 200,
        status: true,
        message: 'File berhasil diubah',
      })
    } catch (error) {
      return ctx.response.json({
        statusCode: 500,
        status: false,
        message: error.message,
      })
    }
  }

  async deleteFile(ctx: HttpContext) {
    const fileId = ctx.params.id
    if (!fileId) {
      return ctx.response.json({
        statusCode: 404,
        status: false,
        message: 'File tidak ditemukan',
      })
    }

    const check = await Upload.query().where('id', fileId).first()
    if (!check) {
      return ctx.response.json({
        statusCode: 404,
        status: false,
        message: 'File tidak ditemukan',
      })
    }

    check.deletedAt = DateTime.now()
    await check.save()

    return ctx.response.json({
      statusCode: 200,
      status: true,
      message: 'File berhasil dihapus',
    })
  }

  async recoveryFile(ctx: HttpContext) {
    const fileId = ctx.params.id
    if (!fileId) {
      return ctx.response.json({
        statusCode: 404,
        status: false,
        message: 'File tidak ditemukan',
      })
    }

    const check = await Upload.query().where('id', fileId).first()
    if (!check) {
      return ctx.response.json({
        statusCode: 404,
        status: false,
        message: 'File tidak ditemukan',
      })
    }

    check.deletedAt = null
    await check.save()

    return ctx.response.json({
      statusCode: 200,
      status: true,
      message: 'File berhasil dikembalikan',
    })
  }
}
