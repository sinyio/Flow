export const formatUserName = (user: {
  firstName?: string | null
  lastName?: string | null
  email: string
}) => [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email
