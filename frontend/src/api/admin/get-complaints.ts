import axios, { AxiosInstance } from 'axios'

import { TComplaintType, TComplaintsResponse } from './types'

export const getComplaints = (
  params: { type?: TComplaintType; page?: number; limit?: number },
  axiosInstance: AxiosInstance = axios,
) => axiosInstance.get<TComplaintsResponse>('/admin/complaints', { params })
