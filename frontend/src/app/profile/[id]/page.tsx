import type { TUser } from '@api/user/get-user'
import { getUser } from '@api/user/get-user'

import { loadApiResource } from '@utils/load-api-resource'

import { LoadErrorFallback } from '@views/error-fallback'
import ProfileView from '@views/profile/view'

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params

  const result = await loadApiResource<TUser>(
    () => getUser(id),
    (data): data is TUser => 'id' in data
  )

  if (!result.ok) {
    return <LoadErrorFallback message={result.message} />
  }

  return <ProfileView user={result.data} />
}

export default Page
