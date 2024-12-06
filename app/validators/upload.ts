import vine from '@vinejs/vine'
import { JSONAPIErrorReporter } from './validator_api.js'

export const addUpload = vine.compile(
  vine.object({
    folderId: vine.string().nullable(),
    id: vine.string().nullable(),
    description: vine.string().nullable(),
  })
)

export const renameUpload = vine.compile(
  vine.object({
    name: vine.string().nullable(),
  })
)

export const deleteUpload = vine.compile(
  vine.object({
    id: vine.string().nullable(),
  })
)

export const moveFile = vine.compile(
  vine.object({
    id: vine.string().nullable(),
    targetId: vine.number().nullable(),
  })
)

renameUpload.errorReporter = () => new JSONAPIErrorReporter()

deleteUpload.errorReporter = () => new JSONAPIErrorReporter()

addUpload.errorReporter = () => new JSONAPIErrorReporter()

moveFile.errorReporter = () => new JSONAPIErrorReporter()
