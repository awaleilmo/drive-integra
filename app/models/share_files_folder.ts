import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import User from './user.js'
import Folder from './folder.js'
import Upload from './upload.js'

export default class ShareFilesFolder extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare ownerId: number

  @column()
  declare sharedWithUserId: number

  @column()
  declare folderId: number | null

  @column()
  declare fileId: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'ownerId',
  })
  declare owner: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'sharedWithUserId',
  })
  declare sharedWithUser: BelongsTo<typeof User>

  @belongsTo(() => Folder, {
    foreignKey: 'folderId',
  })
  declare folder: BelongsTo<typeof Folder>

  @belongsTo(() => Upload, {
    foreignKey: 'fileId',
  })
  declare file: BelongsTo<typeof Upload>
}
