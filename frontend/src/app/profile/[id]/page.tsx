import NotFound from 'src/app/not-found'

import type { TUser } from '@api/user/get-user'
import { getUser } from '@api/user/get-user'

import { loadApiResource } from '@utils/load-api-resource'
import { loadProfileTabsInitialData } from '@utils/load-profile-tabs-data'

import ProfileView from '@views/profile/view'

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params

  const result = await loadApiResource<TUser>(
    () => getUser(id),
    (data): data is TUser =>
      typeof data === 'object' &&
      data !== null &&
      'id' in data &&
      typeof (data as TUser).id === 'string'
  )

  if (!result.ok) {
    return <NotFound />
  }

  const { reviews, ads } = await loadProfileTabsInitialData(result.data.id)

  return <ProfileView user={result.data} initialReviews={reviews} initialAds={ads} />
}

export default Page
