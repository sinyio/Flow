import axios, { AxiosInstance } from 'axios'

import { ICreateComplaintPayload } from './types'

export const createComplaint = (
  payload: ICreateComplaintPayload,
  axiosInstance: AxiosInstance = axios,
) => axiosInstance.post('/admin/complaints', payload)
