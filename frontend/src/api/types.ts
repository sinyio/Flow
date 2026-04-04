export interface IApiError {
  message: string
  error?: string
  statusCode?: number
}

export type IStatusOk = {
  status: 'ok'
}
