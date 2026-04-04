import { IApiError } from '@api/types'

export type TLogoutSuccessfullResponse = {
  status: 'ok'
}

export type TLogoutResponse = TLogoutSuccessfullResponse | IApiError
