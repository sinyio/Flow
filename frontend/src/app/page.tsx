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

  // const mock: TGetPopularRoutesResponse = [
  //   {
  //     fromCity: 'Москва',
  //     toCity: 'Магадан',
  //     totalAds: 10,
  //     latestAds: [
  //       {
  //         id: '22222222-2222-2222-2222-222222222222',
  //         title: 'Новое объявление',
  //         image: '/ads/item.png',
  //         description: 'Нужно доставить аккуратно',
  //         status: 'ACTIVE',
  //         startDate: '2026-03-12T00:00:00.000Z',
  //         endDate: '2026-03-20T00:00:00.000Z',
  //         fromCity: 'Москва',
  //         toCity: 'Саратов',
  //         price: 2000,
  //         weight: 0.5,
  //         isFragile: true,
  //         isDocument: false,
  //         packaging: 'BOX',
  //         length: 40,
  //         width: 30,
  //         height: 20,
  //         userState: {
  //           canEdit: false,
  //           role: 'viewer',
  //         },
  //         author: {
  //           id: '123321-12dd1923-d13i-13f5v413',
  //           fullName: 'Иван Иванов',
  //           photo: '/profile/avatar.png',
  //         },
  //         sender: {
  //           id: '123321-12dd1923-d13i-13f5v413',
  //           fullName: 'Иван Иванов',
  //           photo: '/profile/avatar.png',
  //         },
  //         recipient: {
  //           id: '123321-12dd1923-d13i-13f5v413',
  //           fullName: 'Иван Иванов',
  //           photo: '/profile/avatar.png',
  //         },
  //         courier: {
  //           id: '123321-12dd1923-d13i-13f5v413',
  //           fullName: 'Иван Иванов',
  //           photo: '/profile/avatar.png',
  //         },
  //       },
  //     ],
  //   },
  //   {
  //     fromCity: 'Магадан',
  //     toCity: 'Москва',
  //     totalAds: 10,
  //     latestAds: [
  //       {
  //         id: '22222222-2222-2222-2222-222222222222',
  //         title: 'Новое объявление',
  //         image: '/ads/item.png',
  //         description: 'Нужно доставить аккуратно',
  //         status: 'ACTIVE',
  //         startDate: '2026-03-12T00:00:00.000Z',
  //         endDate: '2026-03-20T00:00:00.000Z',
  //         fromCity: 'Москва',
  //         toCity: 'Саратов',
  //         price: 2000,
  //         weight: 0.5,
  //         isFragile: true,
  //         isDocument: false,
  //         packaging: 'BOX',
  //         length: 40,
  //         width: 30,
  //         height: 20,
  //         userState: {
  //           canEdit: false,
  //           role: 'viewer',
  //         },
  //         author: {
  //           id: '123321-12dd1923-d13i-13f5v413',
  //           fullName: 'Иван Иванов',
  //           photo: '/profile/avatar.png',
  //         },
  //         sender: {
  //           id: '123321-12dd1923-d13i-13f5v413',
  //           fullName: 'Иван Иванов',
  //           photo: '/profile/avatar.png',
  //         },
  //         recipient: {
  //           id: '123321-12dd1923-d13i-13f5v413',
  //           fullName: 'Иван Иванов',
  //           photo: '/profile/avatar.png',
  //         },
  //         courier: {
  //           id: '123321-12dd1923-d13i-13f5v413',
  //           fullName: 'Иван Иванов',
  //           photo: '/profile/avatar.png',
  //         },
  //       },
  //     ],
  //   },
  // ]
}

export default Page
