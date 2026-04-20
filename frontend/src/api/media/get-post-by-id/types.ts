import { IApiError } from '@api/types'

import { TMediaPost } from '../types'

export type TGetPostByIdRequest = string

export type TGetPostByIdResponse = TMediaPost | IApiError
