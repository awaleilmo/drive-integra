import Folder from '#models/folder'
import Upload from '#models/upload'
import { decrypt } from '#services/encryption_service'
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import app from '@adonisjs/core/services/app'
import sharp from 'sharp'
import drive from '@adonisjs/drive/services/main'
import { rimrafSync } from 'rimraf'
import {c} from "vite/dist/node/types.d-aGj9QkWt.js";

export default class UploadsController {
  async store(ctx: HttpContext) {
    try {
      const user = ctx.auth.user!
      // const payload = await addUpload.validate(ctx.request.all)

      const files = ctx.request.file('file')
      let folderId = ctx.request.input('folderId', null)
      let folderPath = `uploads/${user.id}`
      const replace = ctx.request.input('replace', false) as boolean
      const isDuplicate = ctx.request.input('isDuplicate', false) as boolean

      if (folderId && folderId !== 'null' && folderId !== '') {
        const decryptId = decrypt(ctx.request.input('folderId'))
        const splitDec = decryptId.split(':')
        folderId = Number.parseInt(splitDec[1])
        const checkFolder = await Folder.find(folderId)
        folderPath = checkFolder.folderPath
      }

      const fileName = ctx.request.input('fileName', '')
      const fileRaw = Date.now() + files.clientName
      const filePath = `${folderPath}/${fileRaw}`
      const thumbnailPath = `uploads/thumbnail/${user.id + 'sdf' + fileRaw}`

      if (isDuplicate) {
        if (replace) {
          await this.incrementVersion(folderId, files.clientName, user.id)
        } else {
          await this.incrementSameFileCount(folderId, files.clientName, user.id)
        }
      }
      try {
        await files.move(app.publicPath(folderPath), {
          name: fileRaw,
          overwrite: true,
        })
      } catch (error) {
        console.log(error)
      }

      try {
        if (files.type === 'image') {
          if (files.extname === 'svg') {
            await sharp(app.publicPath(filePath)).toFile(thumbnailPath)
          } else {
            await sharp(app.publicPath(filePath)).resize(150, 150).toFile(thumbnailPath)
          }
        }
      } catch (error) {
        console.log(error)
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
        message: `File " ${fileName} " berhasil diupload`,
      })
    } catch (error) {
      ctx.response.json({
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
      let dataResult = []
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
      const Folders = folderId && folderId !== 'null' && folderId !== '' ? folderId : null
      const check = await Upload.query()
        .where('file_name', fileName)
        .where('user_id', userId)
        .where('folder_id', Folders)
        .first()
      check.sameFileCount = check.sameFileCount + 1
      check.save()
      return true
    } catch (error) {
      console.log(error)
    }
  }

  async incrementVersion(folderId: number | null, fileName: string, userId: number) {
    try {
      const Folders = folderId && folderId !== 'null' && folderId !== '' ? folderId : null
      const check = await Upload.query()
        .where('file_name', fileName)
        .where('user_id', userId)
        .where('folder_id', Folders)
        .first()
      check.version = check.version + 1
      check.save()
      return true
    } catch (error) {
      console.log(error)
    }
  }
}
