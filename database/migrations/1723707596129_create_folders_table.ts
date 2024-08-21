import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'folders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE') // Foreign key ke tabel users
      table
        .integer('parent_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('folders')
        .onDelete('CASCADE') // Referensi ke parent folder
      table.string('folder_name', 255).notNullable() // Nama folder
      table.string('folder_path', 255).notNullable() // Path folder
      table.boolean('is_starred').defaultTo(false)

      table.timestamp('opened_at').nullable()
      table.integer('opened_by').nullable()
      table.timestamp('created_at').notNullable()
      table.integer('created_by').nullable()
      table.timestamp('updated_at').nullable()
      table.integer('updated_by').nullable()
      table.timestamp('deleted_at').nullable()
      table.index(['user_id', 'folder_name']) // Index untuk pencarian cepat
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
