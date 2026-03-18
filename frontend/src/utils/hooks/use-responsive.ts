import { useMemo } from 'react'

import { useMediaQuery } from './use-media-query'

export const useResponsive = (): 'mobile' | 'tablet' | 'desktop' => {
  // Important: prevent SSR/CSR mismatch.
  // On server we can't evaluate `window.matchMedia`, so we render with `defaultValue=false`,
  // then update after hydration.
  const isMobile = useMediaQuery('(max-width: 500px)', {
    defaultValue: false,
    initializeWithValue: false,
  })
  const isTablet = useMediaQuery('(max-width: 1200px)', {
    defaultValue: false,
    initializeWithValue: false,
  })

  const device = useMemo(() => {
    if (isMobile) {
      return 'mobile'
    } else if (isTablet) {
      return 'tablet'
    } else {
      return 'desktop'
    }
  }, [isMobile, isTablet])

  return device
}
