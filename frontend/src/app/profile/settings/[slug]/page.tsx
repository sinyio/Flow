import NotFound from 'src/app/not-found'

import { getServerAxiosInstance } from '@api/server-axios-instance'
import type { TUser } from '@api/user/get-user'
import { getUser } from '@api/user/get-user'

import { loadApiResource } from '@utils/load-api-resource'

import ProfileSettings from '@views/profile/settings/view'

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params
  const serverAxios = await getServerAxiosInstance()

  const result = await loadApiResource<TUser>(
    () => getUser(slug, serverAxios),
    (data): data is TUser =>
      typeof data === 'object' &&
      data !== null &&
      'id' in data &&
      typeof (data as TUser).id === 'string'
  )

  if (!result.ok) {
    return <NotFound />
  }

  return <ProfileSettings user={result.data} />
}

export default Page
