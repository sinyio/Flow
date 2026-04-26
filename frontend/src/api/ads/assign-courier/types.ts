import { IApiError, IStatusOk } from '@api/types'

export type TAssignCourierRequest = {
  adId: string
  courierId: string
}

export type TAssignCourierResponse = IStatusOk | IApiError
