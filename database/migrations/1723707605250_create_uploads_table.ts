import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'uploads'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table
        .integer('folder_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('folders')
        .onDelete('CASCADE')
      table.string('file_name', 255).notNullable()
      table.string('file_size', 255).notNullable()
      table.string('file_path', 255).notNullable()
      table.string('file_type', 255).notNullable()
      table.string('file_ext', 255).notNullable()
      table.string('thumbnail_path', 255).nullable()
      table.text('description').nullable()
      table.boolean('is_starred').defaultTo(false)

      table.timestamp('opened_at').nullable()
      table.integer('opened_by').nullable()
      table.timestamp('created_at').notNullable()
      table.integer('created_by').nullable()
      table.timestamp('updated_at').nullable()
      table.integer('updated_by').nullable()
      table.timestamp('deleted_at').nullable()

      table.index(['user_id', 'file_name'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
