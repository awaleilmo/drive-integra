import vine from '@vinejs/vine'
import { JSONAPIErrorReporter } from './validator_api.js'

export const loginUserValidator = vine.compile(
  vine.object({
    email: vine.string().trim(),
    password: vine.string().trim().minLength(6),
  })
)
loginUserValidator.errorReporter = () => new JSONAPIErrorReporter()
