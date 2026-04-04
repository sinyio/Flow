import { getPopularRoutes, TGetPopularRoutesResponse } from '@api/ads'

import { loadApiResource } from '@utils/load-api-resource'

import { LoadErrorFallback } from '@views/error-fallback'
import { FeedView } from '@views/feed'

const Page = async () => {
  const response = await loadApiResource<TGetPopularRoutesResponse>(
    () => getPopularRoutes(),
    (data): data is TGetPopularRoutesResponse => Array.isArray(data)
  )

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

  if (!response.ok) {
    return <LoadErrorFallback message={response.message} />
  }

  return <FeedView routes={response.data} />
}

export default Page
