import { DateTime } from 'luxon'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import {
  BaseModel,
  column,
  belongsTo,
  hasMany,
  beforeCreate,
  beforeUpdate,
} from '@adonisjs/lucid/orm'
import User from './user.js'
import Upload from './upload.js'
import Folders from './folder.js'
import { HttpContext } from '@adonisjs/core/http'

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

  @beforeCreate()
  static async createAndUpdateBy(folder: Folder) {
    const auth = HttpContext.get()?.auth
    if (auth) {
      const userId = auth.user?.id
      if (userId) {
        folder.createdBy = userId
        folder.updatedBy = userId
      }
    }
  }

  @beforeUpdate()
  static async UpdateBy(folder: Folder) {
    const auth = HttpContext.get()?.auth
    if (auth) {
      const userId = auth.user?.id
      if (userId) {
        folder.updatedBy = userId
      }
    }
  }
}
