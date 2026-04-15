'use client'

import { useApiContext } from '@contexts/api-context'

export function useAxiosInstance() {
  return useApiContext().apiClient
}
