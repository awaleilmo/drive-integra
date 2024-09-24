import fs from 'node:fs'
import path from 'node:path'
import app from '@adonisjs/core/services/app'

export default class FolderCheckService {
  static async run() {
    const publicPath = app.publicPath()
    const folders = ['thumbnail', 'uploads']
    folders.forEach((folder) => {
      const folderPath = path.join(publicPath, folder)
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true })
        console.log(`Folder ${folder} telah dibuat di ${folderPath}.`)
      }
    })
  }
}
