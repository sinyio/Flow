import { IApiError } from '@api/types'

export type TDeleteUserSuccessfullResponse = {
  status: 'ok'
}

export type TDeleteUserResponse = TDeleteUserSuccessfullResponse | IApiError
