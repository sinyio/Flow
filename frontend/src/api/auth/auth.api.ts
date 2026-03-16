import type {
  AuthApiError,
  LoginPayload,
  LoginResponse,
  LogoutResponse,
  RegisterPayload,
  RegisterResponse,
} from './types'

import { apiClient } from '../client'

export const authApi = {
  register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
    const { data } = await apiClient.post<RegisterResponse>('/auth/register', payload)

    return data
  },

  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', payload)

    return data
  },

  logout: async (): Promise<LogoutResponse> => {
    const { data } = await apiClient.post<LogoutResponse>('/auth/logout')

    return data
  },

  me: async (): Promise<boolean> => {
    const { data } = await apiClient.get<boolean>('/auth/me')

    return data
  },
}

export type { AuthApiError }
