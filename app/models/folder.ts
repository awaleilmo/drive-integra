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
  declare isStarred: boolean

  @column({
    consume: (value) => {
      try {
        return value ? JSON.parse(value) : []
      } catch {
        return []
      }
    },
    prepare: (value) => JSON.stringify(value ?? []),
  })
  declare sharedWithUsers: number[]

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

  @belongsTo(() => Folder, {
    foreignKey: 'parentId',
  })
  declare parent: BelongsTo<typeof Folder>

  @hasMany(() => Folders, {
    foreignKey: 'parentId',
  })
  declare folders: HasMany<typeof Folders>

  @hasMany(() => Upload, {
    foreignKey: 'folderId',
  })
  declare uploads: HasMany<typeof Upload>

  @belongsTo(() => User, {
    foreignKey: 'openedBy',
  })
  declare openedByUser: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'updatedBy',
  })
  declare updatedByUser: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'createdBy',
  })
  declare createdByUser: BelongsTo<typeof User>

  @hasMany(() => User, {
    foreignKey: 'id',
  })
  declare sharedUsers: HasMany<typeof User>

  async loadSharedUsers() {
    if (!this.sharedWithUsers || this.sharedWithUsers.length === 0) {
      return []
    }
    return await User.query().whereIn('id', this.sharedWithUsers)
  }
}
