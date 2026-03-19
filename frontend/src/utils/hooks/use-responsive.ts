import { useEffect, useMemo, useState } from 'react'

import { useMediaQuery } from './use-media-query'

export const useResponsive = (): {
  device: 'mobile' | 'tablet' | 'desktop'
  vw: number | undefined
  vh: number | undefined
} => {
  // Important: prevent SSR/CSR mismatch.
  // On server we can't evaluate `window.matchMedia`, so we render with `defaultValue=false`,
  // then update after hydration.

  const [vw, setVw] = useState<number | undefined>()
  const [vh, setVh] = useState<number | undefined>()

  const isMobile = useMediaQuery('(max-width: 500px)', {
    defaultValue: false,
    initializeWithValue: false,
  })
  const isTablet = useMediaQuery('(max-width: 1200px)', {
    defaultValue: false,
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
    if (isMobile) {
      return 'mobile'
    } else if (isTablet) {
      return 'tablet'
    } else {
      return 'desktop'
    }
  }, [isMobile, isTablet])

  return { device, vw, vh }
}
