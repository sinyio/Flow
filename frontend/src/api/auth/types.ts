export interface RegisterPayload {
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterResponse {
  stasus: 'ok'
  message: string
}

export interface LoginResponse {
  status: 'ok'
}

export interface LogoutResponse {
  status: 'ok'
}

export interface AuthApiError {
  message: string
  error?: string
  statusCode?: number
}
