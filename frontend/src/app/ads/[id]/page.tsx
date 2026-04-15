import NotFound from 'src/app/not-found'

import { getAdById, type TAd } from '@api/ads'

import { loadApiResource } from '@utils/load-api-resource'

import { AdView } from '@views/ad'

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params

  const result = await loadApiResource<TAd>(
    () => getAdById(id),
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

  return <AdView ad={result.data} />
}

export default Page
