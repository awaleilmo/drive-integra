import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'share_files_folders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('owner_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table
        .integer('shared_with_user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table
        .integer('folder_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('folders')
        .onDelete('CASCADE')
      table
        .integer('file_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('uploads')
        .onDelete('CASCADE')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.unique(['owner_id', 'shared_with_user_id', 'folder_id', 'file_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
