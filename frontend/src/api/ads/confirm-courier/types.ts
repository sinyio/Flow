import { IApiError, IStatusOk } from '@api/types'

export type TConfirmCourierRequest = {
  adId: string
}

export type TConfirmCourierResponse = IStatusOk | IApiError
