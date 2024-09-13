import type { HttpContext } from '@adonisjs/core/http'
import Upload from '#models/upload'
import Folder from '#models/folder'

export default class StarsController {
  async toggleStarFile({ params, auth, response }: HttpContext) {
    const file = await Upload.query()
      .where('id', params.id)
      .where('userId', auth.user?.id)
      .firstOrFail()
    file.isStarred = !file.isStarred
    await file.save()

    return response.ok({ message: 'File star status updated', is_starred: file.isStarred })
  }

  async toggleStarFolder({ params, auth, response }: HttpContext) {
    const folder = await Folder.query()
      .where('id', params.id)
      .where('userId', auth.user?.id)
      .firstOrFail()
    folder.isStarred = !folder.isStarred
    await folder.save()

    return response.ok({ message: 'Folder star status updated', is_starred: folder.isStarred })
  }
}
