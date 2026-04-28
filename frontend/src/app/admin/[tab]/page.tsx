import { AdminView } from '@views/admin'

const Page = async ({ params }: { params: Promise<{ tab: string }> }) => {
  const { tab } = await params
  return <AdminView tab={tab} />
}

export default Page
