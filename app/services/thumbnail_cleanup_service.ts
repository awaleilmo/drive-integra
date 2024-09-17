import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import { rimrafSync } from 'rimraf'

import Upload from '#models/upload'
export default class ThumbnailCleanupService {
  static async run() {
    try {
      console.log('Running Thumbnail Cleanup Service...')

      // eslint-disable-next-line @typescript-eslint/naming-convention
      const __fileName = fileURLToPath(import.meta.url)
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const __dirName = dirname(__fileName)
      const uploadPath = path.join(__dirName, '..', '..', 'public', 'thumbnail')
      const filesInDb = await Upload.query().select('thumbnail_path').whereNotNull('thumbnail_path')
      const fileNamesInDb = filesInDb.map((file) => {
        const split = file.thumbnailPath.split('/')
        return split[split.length - 1]
      })

      const userDirs = await fs.readdir(uploadPath)

      // Loop through each user directory
      for (const userDir of userDirs) {
        const userDirPath = path.join(uploadPath, userDir)
        if (!fileNamesInDb.includes(userDir)) {
          await new Promise((resolve, reject) => {
            try {
              rimrafSync(userDirPath, { glob: false })
              console.log(`Thumbnail ${userDir} deleted successfully`)
              resolve()
            } catch (error) {
              console.error(`Error deleting thumbnail ${userDir}:`, error)
              reject(error)
            }
          })
        }
      }
    } catch (error) {
      console.error('An error occurred during the cleanup of thumbnails process:', error)
    }
  }
}
