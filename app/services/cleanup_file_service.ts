import Upload from '#models/upload'
import Folder from '#models/folder'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

import { rimrafSync } from 'rimraf'

export default class CleanupFileService {
  static async run() {
    try {
      console.log('Running Cleanup File Service...')

      // eslint-disable-next-line @typescript-eslint/naming-convention
      const __fileName = fileURLToPath(import.meta.url)
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const __dirName = dirname(__fileName)
      const uploadPath = path.join(__dirName, '..', '..', 'public', 'uploads')

      // Fetch files and folders from the database
      const filesInDb = await Upload.query().select('file_name')
      const foldersInDb = await Folder.query().select('folder_name')

      const fileNamesInDb = filesInDb.map((file) => file.file_name)
      const folderNamesInDb = foldersInDb.map((folder) => folder.folder_name)

      // Read all items in the uploads directory
      const userDirs = await fs.readdir(uploadPath)

      // Loop through each user directory
      for (const userDir of userDirs) {
        const userDirPath = path.join(uploadPath, userDir)

        const stats = await fs.stat(userDirPath)
        if (stats.isDirectory()) {
          const items = await fs.readdir(userDirPath)

          for (const item of items) {
            const itemPath = path.join(userDirPath, item)
            const itemStats = await fs.stat(itemPath)

            if (itemStats.isDirectory()) {
              // Folder case
              if (!folderNamesInDb.includes(item)) {
                await new Promise((resolve, reject) => {
                  try {
                    rimrafSync(itemPath, { glob: false })
                    console.log(`Folder ${item} deleted successfully`)
                    resolve()
                  } catch (error) {
                    console.error(`Error deleting folder ${item}:`, error)
                    reject(error)
                  }
                })
              }
            } else {
              // File case
              if (!fileNamesInDb.includes(item)) {
                await new Promise((resolve, reject) => {
                  try {
                    rimrafSync(itemPath, { glob: false })
                    console.log(`File ${item} deleted successfully`)
                    resolve()
                  } catch (error) {
                    console.error(`Error deleting file ${item}:`, error)
                    reject(error)
                  }
                })
              }
            }
          }

          // Re-read the directory to see if it's empty, then delete it
          const remainingItems = await fs.readdir(userDirPath)
          if (remainingItems.length === 0) {
            await new Promise((resolve, reject) => {
              try {
                rimrafSync(userDirPath, { glob: false })
                console.log(`User's folder ${userDir} deleted successfully`)
                resolve()
              } catch (error) {
                console.error(`Error deleting user's folder ${userDir}:`, error)
                reject(error)
              }
            })
          }
        }
      }
    } catch (error) {
      console.error('An error occurred during the cleanup process:', error)
    }
  }
}
