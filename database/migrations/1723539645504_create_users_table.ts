import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('role_id').unsigned().references('id').inTable('roles').onDelete('CASCADE')
      table.string('full_name').notNullable()
      table.string('username').notNullable().unique()
      table.string('email', 255).notNullable().unique()
      table.string('password', 255).notNullable()
      table.string('is_active').defaultTo(1)
      table.string('remember_me_token').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}