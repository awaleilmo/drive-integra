import { BaseSeeder } from '@adonisjs/lucid/seeders'
import RoleSeeder from './role_seeder.js'
import UserSeeder from './user_seeder.js'

export default class extends BaseSeeder {
  async run() {
    await new RoleSeeder(this.client).run()
    await new UserSeeder(this.client).run()
  }
}
