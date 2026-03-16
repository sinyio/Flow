import axios from 'axios'

const baseURL =
  typeof window !== 'undefined'
    ? (process.env.NEXT_PUBLIC_API_URL ?? '')
    : (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001')

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})
