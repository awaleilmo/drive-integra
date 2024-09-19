import Upload from '#models/upload'
import Folder from '#models/folder'
import fs from 'node:fs'
import path from 'node:path'

export default class CleanupFileService {
  static async run() {
    console.log('Running Cleanup File Service...')
    const uploadPath = path.join(
      path.dirname(url.fileURLToPath(import.meta.url)),
      '..',
      '..',
      'public',
      'uploads'
    )

    // Fetch files and folders from the database
    const filesInDb = await Upload.query().select('fila_path')
    const foldersInDb = await Folder.query().select('folder_name')

    const fileNamesInDb = filesInDb.map((file) => {
      const split = file.ilaPath.split('/')
      return split[split.length - 1]
    })
    console.log('File names in database:', fileNamesInDb)
    const folderNamesInDb = foldersInDb.map((folder) => folder.folderName)

    // Read all items in the uploads directory
    fs.readdir(uploadPath, (err, userDirs) => {
      if (err) {
        console.error('Error reading uploads directory:', err)
        return
      }

      // Loop through each user directory
      userDirs.forEach((userDir) => {
        const userDirPath = path.join(uploadPath, userDir)
        fs.stat(userDirPath, (err1, stats) => {
          if (err1) {
            console.error(`Error getting stats of ${userDir}:`, err1)
            return
          }

          if (stats.isDirectory()) {
            fs.readdir(userDirPath, (err2, items) => {
              if (err2) {
                console.error(`Error reading user's folder ${userDir}:`, err2)
                return
              }

              items.forEach((item) => {
                const itemPath = path.join(userDirPath, item)
                fs.stat(itemPath, (err3, itemStats) => {
                  if (err3) {
                    console.error(`Error getting stats of ${item}:`, err2)
                    return
                  }

                  if (itemStats.isDirectory()) {
                    if (!folderNamesInDb.includes(item)) {
                      fs.readdir(itemPath, (err4, files) => {
                        if (err4) {
                          console.error(`Error reading folder ${item}:`, err4)
                          return
                        }

                        files.forEach((file) => {
                          fs.unlink(path.join(itemPath, file), (err5) => {
                            if (err5) {
                              console.error(`Error deleting file ${file}:`, err5)
                            } else {
                              console.log(`File ${file} deleted successfully`)
                            }
                          })
                        })

                        fs.rmdir(itemPath, (err6) => {
                          if (err) {
                            console.error(`Error deleting folder ${item}:`, err6)
                          } else {
                            console.log(`Folder ${item} deleted successfully`)
                          }
                        })
                      })
                    }
                  } else {
                    if (!fileNamesInDb.includes(item)) {
                      fs.unlink(itemPath, (err7) => {
                        if (err7) {
                          console.error(`Error deleting file ${item}:`, err7)
                        } else {
                          console.log(`File ${item} deleted successfully`)
                        }
                      })
                    }
                  }
                })
              })

              fs.readdir(userDirPath, (err8, remainingItems) => {
                if (err) {
                  console.error(`Error re-reading user's folder ${userDir}:`, err8)
                  return
                }

                if (remainingItems.length === 0) {
                  fs.rmdir(userDirPath, (err9) => {
                    if (err) {
                      console.error(`Error deleting user's folder ${userDir}:`, err9)
                    } else {
                      console.log(`User's folder ${userDir} deleted successfully`)
                    }
                  })
                }
              })
            })
          }
        })
      })
    })
  }
}
