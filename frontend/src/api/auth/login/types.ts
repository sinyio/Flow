import { IApiError } from '@api/types'

export type TLoginRequest = {
  email: string
  password: string
}

export type TLoginSuccessfullResponse = {
  status: 'ok'
}
export type TLoginResponse = TLoginSuccessfullResponse | IApiError
