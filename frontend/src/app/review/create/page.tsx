import { redirect } from 'next/navigation'

import { getAdById } from '@api/ads/get-ad-by-id'
import { me } from '@api/auth'
import { getReviewsByUser } from '@api/reviews/get-reviews-by-user'
import { getServerAxiosInstance } from '@api/server-axios-instance'
import { getUser } from '@api/user/get-user'

import { CreateReviewView } from '@views/review/create'

interface IReviewCreatePageProps {
  searchParams: Promise<{ userId?: string; adId?: string }>
}

const ReviewCreatePage = async ({ searchParams }: IReviewCreatePageProps) => {
  const params = await searchParams
  const { userId, adId } = params

  // Проверка обязательных параметров
  if (!userId || !adId) {
    redirect('/404')
  }

  const axios = await getServerAxiosInstance()

  try {
    // Параллельная загрузка всех данных
    const [userResponse, adResponse, reviewsResponse, currentUserResponse] = await Promise.all([
      getUser(userId, axios),
      getAdById(adId, axios),
      getReviewsByUser({ userId }, axios),
      me(axios),
    ])

    // Проверка успешности загрузки
    if ('error' in userResponse.data) {
      redirect('/404')
    }

    if ('error' in adResponse.data) {
      redirect('/404')
    }

    if (!('id' in userResponse.data)) {
      redirect('/404')
    }

    const user = userResponse.data
    const ad = adResponse.data
    const reviews = 'data' in reviewsResponse.data ? reviewsResponse.data.data : []

    // Определяем заголовок формы на основе роли текущего пользователя
    let reviewTitle = 'Оцените работу'

    if ('userId' in currentUserResponse.data) {
      const currentUserId = currentUserResponse.data.userId

      // Если текущий пользователь = автор объявления → оцениваем курьера
      if ('authorId' in ad && ad.authorId === currentUserId) {
        reviewTitle = 'Оцените работу курьера'
      }
      // Если текущий пользователь = курьер → оцениваем заказчика
      else if ('courierId' in ad && ad.courierId === currentUserId) {
        reviewTitle = 'Оцените работу заказчика'
      }
    }

    return <CreateReviewView user={user} adId={adId} reviews={reviews} reviewTitle={reviewTitle} />
  } catch (error) {
    console.error('[ReviewCreatePage] Error loading data:', error)
    redirect('/404')
  }
}

export default ReviewCreatePage
