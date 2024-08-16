import { DateTime } from 'luxon'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import Upload from './upload.js'
import Folders from './folder.js'

export default class Folder extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare parentId: number | null

  @column()
  declare folderName: string

  @column()
  declare folderPath: string

  @column()
  declare openedAt: DateTime | null

  @column()
  declare openedBy: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column()
  declare createdBy: number

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare updatedBy: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Folder, {
    foreignKey: 'parentId',
  })
  declare parent: BelongsTo<typeof Folder>

  @hasMany(() => Folders, {
    foreignKey: 'parentId',
  })
  declare folders: HasMany<typeof Folders>

  @hasMany(() => Upload)
  declare uploads: HasMany<typeof Upload>

}