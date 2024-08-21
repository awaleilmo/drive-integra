import type { HttpContext } from '@adonisjs/core/http'

export default class HomeController {
  async index(ctx: HttpContext) {
    return ctx.inertia.render('home', { auth: ctx.auth.user })
  }
}
