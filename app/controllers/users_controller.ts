import User from '#models/user'
import { loginUserValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'

export default class UsersController {
  async login(ctx: HttpContext) {
    try {
      const payload = await loginUserValidator.validate(ctx.request.all())
      const result = await User.findBy('email', payload.email)
      if (result) {
        const check = await hash.verify(result.password, payload.password)
        if (check) {
          await ctx.auth.use('web').login(result)
          return ctx.response.json({ status: true, message: 'Login success' })
        }
        return ctx.response.json({ status: false, message: 'Password incorrect', data: check })
      }
      return ctx.response.json({ status: false, message: 'Email not found', data: null })
    } catch (error) {
      return ctx.response.json(error.messages)
    }
  }

  async logout(ctx: HttpContext) {
    await ctx.auth.use('web').logout()
    return ctx.response.redirect('/')
  }

  async showUserBatch(ctx: HttpContext) {
    try {
      const payload = ctx.request.input('ids', [])
      const result = await User.query().whereIn('id', payload)
      return ctx.response.json({
        status: true,
        statusCode: 200,
        message: 'Success',
        data: result,
      })
    } catch (error) {
      ctx.response.json({
        statusCode: 500,
        status: false,
        message: error.message,
      })
    }
  }
}
