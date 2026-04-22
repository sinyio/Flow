'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { useAxiosInstance } from '@api/use-axios-instance'
import { useCurrentUserStore } from '@utils/stores/current-user'

const ProfileSettingsPage = () => {
  const router = useRouter()
  const axiosInstance = useAxiosInstance()
  const { fetch: fetchCurrentUser } = useCurrentUserStore()

  useEffect(() => {
    fetchCurrentUser(axiosInstance)
      .then(userId => {
        if (userId) router.replace(`/profile/settings/${userId}`)
      })
      .catch(error => console.error('[ProfileSettingsPage] me() failed:', error))
  }, [axiosInstance, router])

  return null
}

export default ProfileSettingsPage
