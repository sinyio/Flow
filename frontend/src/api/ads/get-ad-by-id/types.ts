import { IApiError } from '@api/types'

import { TAd } from '../types'

export type TGetAdByIdRequest = string

export type TGetAdByIdResponse = TAd | IApiError
