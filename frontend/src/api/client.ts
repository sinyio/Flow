import axios from 'axios'

const baseURL = process.env.API_HOST || ''

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})
