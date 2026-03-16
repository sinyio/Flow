import { useMemo } from 'react'

import { useMediaQuery } from './use-media-query'

export const useResponsive = (): 'mobile' | 'tablet' | 'desktop' => {
  const isMobile = useMediaQuery('(max-width: 500px)')
  const isTablet = useMediaQuery('(max-width: 1200px)')

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
