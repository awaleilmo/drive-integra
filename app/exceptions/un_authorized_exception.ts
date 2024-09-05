import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

export default class UnAuthorizedException extends Exception {
  static status = 403
  static code = 'E_UNAUTHORIZED'

  async handle(error: this, ctx: HttpContext) {
    ctx.response.status(error.status).send(error.message)
  }

  async report(error: this, ctx: HttpContext) {
    ctx.logger.error({ err: error }, error.message)
  }
}
