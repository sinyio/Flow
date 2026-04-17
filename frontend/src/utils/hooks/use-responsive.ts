'use client'

import { useEffect, useMemo, useState } from 'react'

import { useServerData } from '@utils/server-data-provider'

import { useMediaQuery } from './use-media-query'

export const useResponsive = (): {
  device: 'mobile' | 'tablet' | 'desktop'
  vw: number | undefined
  vh: number | undefined
} => {
  const data = useServerData()

  const [vw, setVw] = useState<number | undefined>()
  const [vh, setVh] = useState<number | undefined>()

  const isTablet = useMediaQuery('(min-width: 834px)', {
    defaultValue: data?.deviceType === 'tablet' ? true : false,
    initializeWithValue: false,
  })
  const isDesktop = useMediaQuery('(min-width: 1280px)', {
    defaultValue: data?.deviceType === 'desktop' ? true : false,
    initializeWithValue: false,
  })

  useEffect(() => {
    const resize = () => {
      setVw(window.innerWidth)
      setVh(window.innerHeight)
    }

    resize()

    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  const device = useMemo(() => {
    if (isDesktop) {
      return 'desktop'
    } else if (isTablet) {
      return 'tablet'
    } else {
      return 'mobile'
    }
  }, [isTablet, isDesktop])

  return { device, vw, vh }
}
