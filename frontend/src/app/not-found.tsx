import { PageContainer } from '@components/global/page-container'

import NotFoundView from '@views/not-found-view'

const NotFound = () => (
  <PageContainer>
    <NotFoundView title="Страница не найдена" description="По этому адресу ничего нет." />
  </PageContainer>
)

export default NotFound
