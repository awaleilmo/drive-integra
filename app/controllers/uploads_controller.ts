import Folder from '#models/folder'
import Upload from '#models/upload'
import { decrypt } from '#services/encryption_service'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import sharp from 'sharp'

export default class UploadsController {
  async store(ctx: HttpContext) {
    try {
      const user = ctx.auth.user!
      // const payload = await addUpload.validate(ctx.request.all)

      const files = ctx.request.file('file')
      let folderId = ctx.request.input('folderId', null)
      let folderPath = `uploads/${user.id}`

      if (folderId && folderId !== 'null' && folderId !== '') {
        const decryptId = decrypt(ctx.request.input('folderId'))
        const splitDec = decryptId.split(':')
        folderId = Number.parseInt(splitDec[1])
        const checkFolder = await Folder.find(folderId)
        folderPath = checkFolder.folderPath
      }

      const fileName = `${files.clientName}`
      const filePath = `${folderPath}/${fileName}`
      const thumbnailPath = `thumbnail/${user.id + 'sdf' + fileName}`

      await files.move(app.publicPath(folderPath), {
        name: fileName,
        overwrite: true,
      })

      if (files.type === 'image') {
        if (files.extname === 'svg') {
          await sharp(app.publicPath(folderPath + '/' + fileName)).toFile(
            app.publicPath(thumbnailPath)
          )
        } else {
          await sharp(app.publicPath(folderPath + '/' + fileName))
            .resize(150, 150)
            .toFile(app.publicPath(thumbnailPath))
        }
      }

      if (!files.isValid) {
        return ctx.response.json({
          status: false,
          message: 'File gagal diupload',
        })
      }

      if (folderId && folderId !== 'null' && folderId !== '') {
        await Upload.updateOrCreate(
          { fileName, userId: user.id, folderId }, // Jika folderId tidak null
          {
            fileSize: files.size,
            fileType: files.type,
            filePath,
            fileExt: files.extname,
            thumbnailPath: files.type.startsWith('image') ? thumbnailPath : null,
            description: ctx.request.input('description'),
            createdBy: user.id,
            updatedBy: user.id,
          }
        )
      } else {
        await Upload.updateOrCreate(
          { fileName, userId: user.id }, // Jika folderId null
          {
            fileSize: files.size,
            fileType: files.type,
            filePath,
            fileExt: files.extname,
            thumbnailPath: files.type.startsWith('image') ? thumbnailPath : null,
            description: ctx.request.input('description'),
            createdBy: user.id,
            updatedBy: user.id,
          }
        )
      }

      return ctx.response.json({
        status: true,
        message: 'File berhasil diupload',
      })
    } catch (error) {
      ctx.response.json({
        status: false,
        message: error.message,
      })
    }
  }
}
