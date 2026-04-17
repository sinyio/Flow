import {
  getAds,
  getPopularRoutes,
  TGetAdsParams,
  TGetAdsSuccessfullResponse,
  TRoute,
} from '@api/ads'

import { loadApiResource } from '@utils/load-api-resource'

import { FeedView } from '@views/feed'

const Page = async ({ searchParams }: { searchParams: Promise<TGetAdsParams> }) => {
  const searchParamsObject = await searchParams

  const settings = Object.keys(searchParamsObject).length > 0 ? searchParamsObject : undefined

  if (settings) {
    const adsResponse = await loadApiResource<TGetAdsSuccessfullResponse>(
      () => getAds(settings),
      (data): data is TGetAdsSuccessfullResponse =>
        typeof data === 'object' &&
        data !== null &&
        'data' in data &&
        'meta' in data &&
        Array.isArray((data as TGetAdsSuccessfullResponse).data)
    )

    if (!adsResponse.ok) {
      throw new Error(adsResponse?.message)
    }

    return <FeedView ads={adsResponse.data} settings={settings} />
  } else {
    const popularRoutesResponse = await loadApiResource<TRoute[]>(
      () => getPopularRoutes(),
      (data): data is TRoute[] => Array.isArray(data)
    )

    if (!popularRoutesResponse.ok) {
      throw new Error(popularRoutesResponse?.message)
    }

    return <FeedView routes={popularRoutesResponse.data} settings={settings} />
  }
}

export default Page
