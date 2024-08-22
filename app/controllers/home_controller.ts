import type { HttpContext } from '@adonisjs/core/http'

export default class HomeController {
  async home(ctx: HttpContext) {
    return ctx.inertia.render('home', { auth: ctx.auth.user })
  }
  async shared(ctx: HttpContext) {
    return ctx.inertia.render('shared', { auth: ctx.auth.user })
  }
  async starry(ctx: HttpContext) {
    return ctx.inertia.render('starry', { auth: ctx.auth.user })
  }
  async latest(ctx: HttpContext) {
    return ctx.inertia.render('latest', { auth: ctx.auth.user })
  }
  async trash(ctx: HttpContext) {
    return ctx.inertia.render('trash', { auth: ctx.auth.user })
  }
}
