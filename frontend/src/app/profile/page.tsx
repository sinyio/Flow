import { me, TMeSuccessfullResponse } from '@api/auth'
import { getUser, TUser } from '@api/user/get-user'

import { loadApiResource } from '@utils/load-api-resource'
import { loadProfileTabsInitialData } from '@utils/load-profile-tabs-data'

import ProfileView from '@views/profile/view'

import NotFound from '../not-found'

const Page = async () => {
  const meResult = await loadApiResource<TMeSuccessfullResponse>(
    () => me(),
    (data): data is TMeSuccessfullResponse => 'userId' in data && typeof data.userId === 'string'
  )

  if (!meResult.ok) {
    return <NotFound />
  }

  const userResult = await loadApiResource<TUser>(
    () => getUser(meResult.data.userId),
    (data): data is TUser =>
      typeof data === 'object' &&
      data !== null &&
      'id' in data &&
      typeof (data as TUser).id === 'string'
  )

  if (!userResult.ok) {
    return <NotFound />
  }

  const { reviews, ads } = await loadProfileTabsInitialData(userResult.data.id)

  return <ProfileView user={userResult.data} initialReviews={reviews} initialAds={ads} />
}

export default Page
