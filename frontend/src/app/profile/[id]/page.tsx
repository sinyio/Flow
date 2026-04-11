import Error from 'src/app/error'
import NotFound from 'src/app/not-found'

import type { TUser } from '@api/user/get-user'
import { getUser } from '@api/user/get-user'

import { loadApiResource } from '@utils/load-api-resource'

import ProfileView from '@views/profile/view'

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params

  const result = await loadApiResource<TUser>(
    () => getUser(id),
    (data): data is TUser => 'id' in data
  )

  if (!result.ok) {
    return <NotFound />
  }

  return <ProfileView user={result.data} />
}

export default Page
