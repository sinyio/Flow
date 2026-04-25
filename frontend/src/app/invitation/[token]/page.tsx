import { InvitationView } from '@views/invitation/view'

const Page = async ({ params }: { params: Promise<{ token: string }> }) => {
  const { token } = await params

  return <InvitationView token={token} />
}

export default Page
