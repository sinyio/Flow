import type { TAdPaginatedResponse, TGetAdsParams } from '@api/ads'

import { getAds } from '@api/ads'
import { loadApiResource } from '@utils/load-api-resource'

import { LoadErrorFallback } from '@views/error-fallback'
import { FeedView } from '@views/feed'

type TSearchParams = Record<string, string | string[] | undefined>

const toBool = (v: string | undefined) => (v === 'true' ? true : v === 'false' ? false : undefined)
const toNumber = (v: string | undefined) => (v && !Number.isNaN(Number(v)) ? Number(v) : undefined)

const pickFirst = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)

const Page = async ({ searchParams }: { searchParams?: Promise<TSearchParams> }) => {
  const sp = (await searchParams) ?? {}

  const params: TGetAdsParams = {
    page: toNumber(pickFirst(sp.page)) ?? 1,
    limit: 9,
    fromCity: pickFirst(sp.fromCity),
    toCity: pickFirst(sp.toCity),
    startDate: pickFirst(sp.startDate),
    endDate: pickFirst(sp.endDate),
    minPrice: toNumber(pickFirst(sp.minPrice)),
    maxWeight: toNumber(pickFirst(sp.maxWeight)),
    isDocument: toBool(pickFirst(sp.isDocument)),
    isFragile: toBool(pickFirst(sp.isFragile)),
  }

  const result = await loadApiResource<TAdPaginatedResponse>(
    () => getAds(params),
    (data): data is TAdPaginatedResponse =>
      typeof data === 'object' && data !== null && 'data' in data
  )

  if (!result.ok) {
    return <LoadErrorFallback message={result.message} />
  }

  const isSearch = Boolean(params.fromCity || params.toCity || params.startDate || params.endDate)

  return <FeedView initial={result.data} query={params} isSearch={isSearch} />
}

export default Page
