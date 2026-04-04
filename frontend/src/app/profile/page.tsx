import { me, TMeResponse } from '@api/auth'
import { getUser, TUser } from '@api/user/get-user'

import { loadApiResource } from '@utils/load-api-resource'

import { LoadErrorFallback } from '@views/error-fallback'
import ProfileView from '@views/profile/view'

const Page = async () => {
  const meResult = await loadApiResource<TMeResponse>(
    () => me(),
    (data): data is TMeResponse => 'userId' in data
  )

  if (!meResult.ok) {
    return <LoadErrorFallback message={meResult.message} />
  }

  const userResult = await loadApiResource<TUser>(
    () => getUser(meResult.data.userId),
    (data): data is TUser => 'id' in data
  )

  if (!userResult.ok) {
    return <LoadErrorFallback message={userResult.message} />
  }

  return <ProfileView user={userResult.data} />
}

export default Page
