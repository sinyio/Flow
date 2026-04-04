import type { TUser } from '@api/user/get-user'
import { getUser } from '@api/user/get-user'

import { loadApiResource } from '@utils/load-api-resource'

import { LoadErrorFallback } from '@views/error-fallback'
import ProfileSettings from '@views/profile/settings/view'

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params

  const result = await loadApiResource<TUser>(
    () => getUser(slug),
    (data): data is TUser => 'id' in data
  )

  if (!result.ok) {
    return <LoadErrorFallback message={result.message} />
  }

  return <ProfileSettings user={result.data} />
}

export default Page
