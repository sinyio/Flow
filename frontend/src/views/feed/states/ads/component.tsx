import { TGetAdsResponse } from '@api/ads'

import { AdCard } from '@entities/ad'

export interface IAdsStateProps {
  ads?: TGetAdsResponse
}

export const AdsState = ({ ads }: IAdsStateProps) =>
  ads && 'data' in ads ? ads.data.map(ad => <AdCard key={ad.id} ad={ad} />) : null
