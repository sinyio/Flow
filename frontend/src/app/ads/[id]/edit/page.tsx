import NotFound from 'src/app/not-found'

import { getAdById, type TAd } from '@api/ads'
import { getServerAxiosInstance } from '@api/server-axios-instance'

import { loadApiResource } from '@utils/load-api-resource'

import { EditAdView } from '@views/ad/edit'

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const serverAxios = await getServerAxiosInstance()

  const result = await loadApiResource<TAd>(
    () => getAdById(id, serverAxios),
    (data): data is TAd =>
      typeof data === 'object' &&
      data !== null &&
      'id' in data &&
      'title' in data &&
      typeof (data as TAd).id === 'string'
  )

  if (!result.ok) {
    return <NotFound />
  }

  return <EditAdView ad={result.data} />
}

export default Page
