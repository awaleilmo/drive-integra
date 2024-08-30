import type { HttpContext } from '@adonisjs/core/http'

export default class FoldersController {
  async addFolder(ctx: HttpContext) {
    const userId = ctx.auth.user?.id

    return ctx.inertia.render('addFolder')
  }
}
