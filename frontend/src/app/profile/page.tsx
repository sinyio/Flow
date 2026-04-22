'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { useAxiosInstance } from '@api/use-axios-instance'
import { useCurrentUserStore } from '@utils/stores/current-user'

const ProfilePage = () => {
  const router = useRouter()
  const axiosInstance = useAxiosInstance()
  const { fetch: fetchCurrentUser } = useCurrentUserStore()

  useEffect(() => {
    fetchCurrentUser(axiosInstance)
      .then(userId => {
        if (userId) router.replace(`/profile/${userId}`)
      })
      .catch(error => console.error('[ProfilePage] me() failed:', error))
  }, [axiosInstance, router])

  return null
}

export default ProfilePage
