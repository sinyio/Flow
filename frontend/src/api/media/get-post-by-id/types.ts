import { IApiError } from '@api/types'

import { TPost } from '../types'

export type TGetPostByIdRequest = string

export type TGetPostByIdResponse = TPost | IApiError
