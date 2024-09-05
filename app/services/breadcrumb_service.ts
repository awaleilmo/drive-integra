import Folder from '#models/folder'
import { encrypt } from '#services/encryption_service'

export default class BreadcrumbsService {
  static async getBreadcrumbs(folderId: number | null) {
    if (folderId === null) {
      // Jika folderId adalah null, kembalikan breadcrumb untuk halaman beranda
      return []
    }

    const breadcrumbs = []
    let currentFolderId = folderId || null

    while (currentFolderId) {
      const folder = await Folder.query().where('id', currentFolderId).first()
      if (folder) {
        const encryptedId = encrypt(folder.id.toString())
        breadcrumbs.unshift({ name: folder.folderName, url: `/home?folders=${encryptedId}` })
        currentFolderId = folder.parentId
      } else {
        currentFolderId = null
      }
    }

    return breadcrumbs
  }
}
