import { IApiError } from '@api/types'

import { TReview } from '../types'

export type TGetReviewByIdRequest = string

export type TGetReviewByIdResponse = TReview | IApiError
