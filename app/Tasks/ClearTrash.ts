import Folder from '#models/folder'
import Upload from '#models/upload'
import { DateTime } from 'luxon'

export default class CleanupTask {
  public static async run() {
    const expirationDate = DateTime.now().minus({ days: 30 })

    const expiredTrashFolder = await Folder.query().where('deleted_at', '<', expirationDate.toISO())
    const expiredTrashFile = await Upload.query().where('deleted_at', '<', expirationDate.toISO())

    for (const itemFolder of expiredTrashFolder) {
      await itemFolder.delete()
    }
    for (const itemUpload of expiredTrashFile) {
      await itemUpload.delete()
    }
  }
}
