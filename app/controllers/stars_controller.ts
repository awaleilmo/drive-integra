import type { HttpContext } from '@adonisjs/core/http'
import Upload from '#models/upload'
import Folder from '#models/folder'

export default class StarsController {
  async toggleStarFile({ params, auth, response }: HttpContext) {
    if (!auth.user)
      return response.json({
        statusCode: 401,
        status: false,
        message: 'Unauthorized',
      })

    if (!params.id || params.id === '')
      return response.json({
        statusCode: 400,
        status: false,
        message: 'Bad Request',
      })

    const user = auth.user!
    const file = await Upload.query().where('id', params.id).where('userId', user.id).firstOrFail()
    file.isStarred = !file.isStarred
    await file.save()

    return response.json({
      statusCode: 200,
      status: true,
      message: 'File star status updated',
      is_starred: file.isStarred,
    })
  }

  async toggleStarFolder({ params, auth, response }: HttpContext) {
    if (!auth.user)
      return response.json({
        statusCode: 401,
        status: false,
        message: 'Unauthorized',
      })

    if (!params.id || params.id === '')
      return response.json({
        statusCode: 400,
        status: false,
        message: 'Bad Request',
      })

    const user = auth.user!
    const folder = await Folder.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()
    folder.isStarred = !folder.isStarred
    await folder.save()

    return response.json({
      statusCode: 200,
      status: true,
      message: 'File star status updated',
      is_starred: folder.isStarred,
    })
  }
}
