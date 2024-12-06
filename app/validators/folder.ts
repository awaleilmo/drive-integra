import vine from '@vinejs/vine'
import { JSONAPIErrorReporter } from './validator_api.js'

export const addFolder = vine.compile(
  vine.object({
    folderName: vine.string().trim(),
  })
)

export const renameFolder = vine.compile(
  vine.object({
    name: vine.string().trim(),
  })
)

export const deleteFolder = vine.compile(
  vine.object({
    id: vine.string().trim(),
  })
)

export const recoveryFolder = vine.compile(
  vine.object({
    id: vine.string().trim(),
  })
)
export const moveFolder = vine.compile(
  vine.object({
    id: vine.string().trim(),
    targetId: vine.number().nullable(),
  })
)

renameFolder.errorReporter = () => new JSONAPIErrorReporter()

deleteFolder.errorReporter = () => new JSONAPIErrorReporter()

recoveryFolder.errorReporter = () => new JSONAPIErrorReporter()

addFolder.errorReporter = () => new JSONAPIErrorReporter()
