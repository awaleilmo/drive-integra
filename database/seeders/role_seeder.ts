import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role from '../../app/models/role.js'

export default class extends BaseSeeder {
  static run() {
    throw new Error('Method not implemented.')
  }
  async run() {
    await Role.updateOrCreateMany('name', [
      {
        name: 'superadmin',
      },
      {
        name: 'admin',
      },
      {
        name: 'user',
      },
    ])
  }
}
