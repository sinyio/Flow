import { useEffect, useMemo, useState } from 'react'

import { useServerData } from '@utils/server-data-provider'

import { useMediaQuery } from './use-media-query'

export const useResponsive = (): {
  device: 'mobile' | 'tablet' | 'desktop'
  vw: number | undefined
  vh: number | undefined
} => {
  // Important: prevent SSR/CSR mismatch.
  // On server we can't evaluate `window.matchMedia`, so we render with `defaultValue=false`,
  // then update after hydration.

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

  const resize = () => {
    setVw(window.innerWidth)
    setVh(window.innerHeight)
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      resize()
    }

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
