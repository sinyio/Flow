import { IApiError } from '@api/types'

export type TMeSuccessfullResponse = {
  status: true
}

export type TMeResponse = TMeSuccessfullResponse | IApiError
