import { getPosts, TGetPostsParams, TGetPostsSuccessResponse } from '@api/media'
import { getServerAxiosInstance } from '@api/server-axios-instance'
import { loadApiResource } from '@utils/load-api-resource'
import { MediaView } from '@views/media'

const isSuccess = (data: unknown): data is TGetPostsSuccessResponse =>
  typeof data === 'object' &&
  data !== null &&
  'data' in data &&
  Array.isArray((data as TGetPostsSuccessResponse).data)

const MediaPage = async ({ searchParams }: { searchParams: Promise<TGetPostsParams> }) => {
  const params = await searchParams
  const serverAxios = await getServerAxiosInstance()

  const hasSearch = Boolean(params.search || params.sort)

  if (hasSearch) {
    const result = await loadApiResource(
      () => getPosts(params, serverAxios),
      isSuccess
    )

    return (
      <MediaView
        searchPosts={result.ok ? result.data.data : []}
        settings={params}
      />
    )
  }

  const [flowResult, userResult] = await Promise.all([
    loadApiResource(
      () => getPosts({ filter: 'flow', limit: 2 }, serverAxios),
      isSuccess
    ),
    loadApiResource(
      () => getPosts({ filter: 'users', sort: 'relevant', limit: 2 }, serverAxios),
      isSuccess
    ),
  ])

  return (
    <MediaView
      flowPosts={flowResult.ok ? flowResult.data.data : []}
      userPosts={userResult.ok ? userResult.data.data : []}
    />
  )
}

export default MediaPage
