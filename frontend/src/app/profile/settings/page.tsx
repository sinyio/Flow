import { redirect } from 'next/navigation'

import NotFound from 'src/app/not-found'

import { me, TMeResponse } from '@api/auth'

import { loadApiResource } from '@utils/load-api-resource'

const Page = async () => {
  const result = await loadApiResource<TMeResponse>(
    () => me(),
    (data): data is TMeResponse => 'userId' in data
  )

  if (result.ok && 'userId' in result.data) {
    redirect('/settings/' + result.data.userId)
  }

  if (!result.ok) {
    return <NotFound />
  }
}

export default Page
