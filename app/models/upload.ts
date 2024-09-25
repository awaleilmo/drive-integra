import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import User from './user.js'
import Folder from './folder.js'

export default class Upload extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare folderId: number | null

  @column()
  declare fileName: string

  @column()
  declare fileSize: string

  @column()
  declare filePath: string

  @column()
  declare fileType: string

  @column()
  declare fileExt: string

  @column()
  declare thumbnailPath: string | null

  @column()
  declare isStarred: boolean

  @column()
  declare sameFileCount: number

  @column()
  declare version: number

  @column()
  declare description: string | null

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

  @column()
  declare deletedAt: DateTime | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Folder)
  declare folder: BelongsTo<typeof Folder>
}
