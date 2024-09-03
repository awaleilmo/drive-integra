import vine from '@vinejs/vine'
import { JSONAPIErrorReporter } from './validator_api.js'

export const addFolder = vine.compile(
  vine.object({
    folderName: vine.string().trim(),
  })
)

addFolder.errorReporter = () => new JSONAPIErrorReporter()
