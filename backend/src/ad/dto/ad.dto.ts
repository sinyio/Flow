import { getUserResponse } from '@/src/user/dto'
import { Ad, User } from '@prisma/client'

type AdWithUser = Ad & { user: User }

export const getAdResponse = (ad: AdWithUser) => ({
  id: ad.id,
  title: ad.title,
  image: ad.image,
  description: ad.description,
  startDate: ad.startDate,
  endDate: ad.endDate,
  fromCity: ad.fromCity,
  toCity: ad.toCity,
  price: ad.price,
  weight: ad.weight,
  isFragile: ad.isFragile,
  isDocument: ad.isDocument,
  packaging: ad.packaging,
  length: ad.length,
  width: ad.width,
  height: ad.height,
  user: getUserResponse(ad.user),
})