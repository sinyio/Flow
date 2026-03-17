import axios from 'axios'

/**
 * Дефолтный инстанс для кода вне ApiProvider.
 * В приложении предпочтительно использовать useAuthApi() (инстанс из контекста с HTTP_HOST).
 */
export function createApiClient(baseURL: string) {
  return axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
