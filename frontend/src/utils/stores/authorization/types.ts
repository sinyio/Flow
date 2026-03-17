import {
  TEmailConfirmationRequest,
  TEmailConfirmationResponse,
  TLoginRequest,
  TLoginResponse,
  TLogoutResponse,
  TRegisterRequest,
  TRegisterResponse,
} from '@api/auth'
import { IApiError } from '@api/types'
import type { AxiosInstance } from 'axios'

export const AUTHORIZATION_STEPS = ['sign-in', 'sign-up', 'forgot-password', 'check-email'] as const

export type TAuthorizationStep = (typeof AUTHORIZATION_STEPS)[number]

export interface IAuthorizationState {
  authorizationStep: TAuthorizationStep
  isAuth: boolean
  isLoading: {
    checkIsAuth: boolean
    register: boolean
    login: boolean
    logout: boolean
    confirmEmail: boolean
  }
}

export interface IAuthorizationActions {
  setAuthorizationStep: (authorizationStep: TAuthorizationStep) => void

  checkIsAuth: (axiosInstance: AxiosInstance) => Promise<boolean | IApiError>

  register: (data: TRegisterRequest, axiosInstance: AxiosInstance) => Promise<TRegisterResponse>

  login: (data: TLoginRequest, axiosInstance: AxiosInstance) => Promise<TLoginResponse>

  logout: (axiosInstance: AxiosInstance) => Promise<TLogoutResponse>

  confirmEmail: (
    data: TEmailConfirmationRequest,
    axiosInstance: AxiosInstance
  ) => Promise<TEmailConfirmationResponse>
}

export type TAuthorizationStore = IAuthorizationState & IAuthorizationActions
