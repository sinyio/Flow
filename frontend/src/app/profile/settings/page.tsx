import { redirect } from 'next/navigation'

import NotFound from 'src/app/not-found'

import { me, TMeSuccessfullResponse } from '@api/auth'

import { loadApiResource } from '@utils/load-api-resource'

const Page = async () => {
  const result = await loadApiResource<TMeSuccessfullResponse>(
    () => me(),
    (data): data is TMeSuccessfullResponse => 'userId' in data && typeof data.userId === 'string'
  )

  if (!result.ok) {
    return <NotFound />
  }

  redirect('/settings/' + result.data.userId)
}

export default Page
