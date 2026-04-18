'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { me } from '@api/auth'
import { useAxiosInstance } from '@api/use-axios-instance'

const ProfileSettingsPage = () => {
  const router = useRouter()
  const axiosInstance = useAxiosInstance()

  useEffect(() => {
    me(axiosInstance)
      .then(response => {
        if ('userId' in response.data) {
          router.replace(`/profile/settings/${response.data.userId}`)
        }
      })
      .catch(error => console.error('[ProfileSettingsPage] me() failed:', error))
  }, [axiosInstance, router])

  return null
}

export default ProfileSettingsPage
