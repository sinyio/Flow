import { me, TMeResponse } from '@api/auth'
import { getUser, TUser } from '@api/user/get-user'

import { loadApiResource } from '@utils/load-api-resource'

import ProfileView from '@views/profile/view'

import NotFound from '../not-found'

const Page = async () => {
  const meResult = await loadApiResource<TMeResponse>(
    () => me(),
    (data): data is TMeResponse => 'userId' in data
  )

  if (!meResult.ok) {
    return <NotFound />
  }

  const userResult = await loadApiResource<TUser>(
    () => getUser(meResult.data.userId),
    (data): data is TUser => 'id' in data
  )

  if (!userResult.ok) {
    return <NotFound />
  }

  return <ProfileView user={userResult.data} />
}

export default Page
