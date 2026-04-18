import type { AxiosInstance } from 'axios'

import { getAdsByUser, type TAd, type TPaginationMeta } from '@api/ads'
import { getReviewsByUser } from '@api/reviews'
import type { TReview } from '@api/reviews/types'

import { loadApiResource } from './load-api-resource'

type TReviewsPage = { data: TReview[]; meta: TPaginationMeta }
type TAdsPage = { data: TAd[]; meta: TPaginationMeta }

/** Данные вкладок профиля для SSR (без действий пользователя). */
export async function loadProfileTabsInitialData(
  userId: string,
  axiosInstance?: AxiosInstance
): Promise<{
  reviews: TReview[]
  ads: TAd[]
}> {
  const reviewsResult = await loadApiResource<TReviewsPage>(
    () => getReviewsByUser({ userId, page: 1, limit: 10, role: 'all' }, axiosInstance),
    (data): data is TReviewsPage =>
      typeof data === 'object' &&
      data !== null &&
      'data' in data &&
      'meta' in data &&
      Array.isArray((data as TReviewsPage).data)
  )

  if (!reviewsResult.ok) {
    console.error('[Profile] getReviewsByUser failed:', reviewsResult.message)
  }

  const adsResult = await loadApiResource<TAdsPage>(
    () => getAdsByUser({ userId, page: 1, limit: 10 }, axiosInstance),
    (data): data is TAdsPage =>
      typeof data === 'object' &&
      data !== null &&
      'data' in data &&
      'meta' in data &&
      Array.isArray((data as TAdsPage).data)
  )

  if (!adsResult.ok) {
    console.error('[Profile] getAdsByUser failed:', adsResult.message)
  }

  return {
    reviews: reviewsResult.ok ? reviewsResult.data.data : [],
    ads: adsResult.ok ? adsResult.data.data : [],
  }
}
