import User from '#models/user'
import { loginUserValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'

export default class UsersController {
    async login({ request, auth, response }: HttpContext) {
        try {
          const payload = await loginUserValidator.validate(request.all())
          const result = await User.findBy('email', payload.email)
          if (result) {
            const check = await hash.verify(result.password, payload.password)
            if (check) {
              await auth.use('web').login(result)
              return response.json({ status: true, message: 'Login success' })
            }
            return response.json({ status: false, message: 'Password incorrect', data: check })
          }
          return response.json({ status: false, message: 'Email not found', data: null })
        } catch (error) {
          return response.json(error.messages)
        }
      }
}