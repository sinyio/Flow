import { redirect } from 'next/navigation'

import { loadApiResource } from '@utils/load-api-resource'
import { me, TMeResponse } from '@api/auth'

import { LoadErrorFallback } from '@views/error-fallback'

const Page = async () => {
  const result = await loadApiResource<TMeResponse>(
    () => me(),
    (data): data is TMeResponse => 'userId' in data
  )

  if (result.ok && 'userId' in result.data) {
    redirect('/settings/' + result.data.userId)
  }

  if (!result.ok) {
    return <LoadErrorFallback message={result.message} />
  }
}

export default Page
