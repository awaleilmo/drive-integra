import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await User.updateOrCreateMany('email', [
      {
        roleId: 1,
        fullName: 'Super Admin',
        username: 'superadmin',
        email: 'SuperAdmin@integrapadma.com',
        password: 'SuperAdmin2020',
        isActive: 1
      }
    ])
  }
}