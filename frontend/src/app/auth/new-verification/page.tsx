import { NewVerificationView } from '@views/authorization/new-verification/view'

const Page = async ({ searchParams }: { searchParams: Promise<{ token: string }> }) => {
  const { token } = await searchParams

  return <NewVerificationView token={token} />
}

export default Page
