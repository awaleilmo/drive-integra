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
        isActive: 1,
      },
      {
        roleId: 2,
        fullName: 'Admin',
        username: 'admin',
        email: 'Admin@integrapadma.com',
        password: 'Admin2020',
        isActive: 1,
      },
      {
        roleId: 3,
        fullName: 'Awaludin',
        username: 'awaludin',
        email: 'awaludin@integrapadma.com',
        password: 'User2020',
        isActive: 1,
      },
    ])
  }
}
