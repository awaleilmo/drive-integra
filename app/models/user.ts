import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, belongsTo, hasMany, beforeCreate } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import Folder from './folder.js'
import Upload from './upload.js'
import Role from './role.js'
import { randomText } from '#services/encryption_service'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare roleId: number

  @column()
  declare fullName: string | null

  @column()
  declare username: string

  @column()
  declare randomString: string

  @column()
  declare isActive: number

  @column()
  declare rememberMeToken: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
  @beforeCreate()
  static async RandomStrings(user: User) {
    user.randomString = randomText(24)
  }

  @belongsTo(() => Role)
  declare role: BelongsTo<typeof Role>

  @hasMany(() => Folder)
  declare folders: HasMany<typeof Folder>

  @hasMany(() => Upload)
  declare uploads: HasMany<typeof Upload>
}
