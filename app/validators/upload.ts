import vine from '@vinejs/vine'
import { JSONAPIErrorReporter } from './validator_api.js'

export const addUpload = vine.compile(
  vine.object({
    folderId: vine.string().nullable(),
    id: vine.string().nullable(),
    description: vine.string().nullable(),
  })
)

addUpload.errorReporter = () => new JSONAPIErrorReporter()
