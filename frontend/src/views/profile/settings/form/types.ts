import { z } from 'zod'

import { settingsSchema } from './validation-schema'

export type TSettingsFormValues = z.infer<typeof settingsSchema>

export type TPasswordChangeFormValues = {
  password: string
}
