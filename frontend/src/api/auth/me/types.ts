import { IApiError } from '@api/types'

export type TMeSuccessfullResponse = {
  userId: string
}

export type TMeResponse = TMeSuccessfullResponse | IApiError
