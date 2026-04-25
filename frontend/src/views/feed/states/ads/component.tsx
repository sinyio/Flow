import { TGetAdsResponse } from '@api/ads'

import { AdCard } from '@entities/ad'

import styles from './component.module.css'

export interface IAdsStateProps {
  ads?: TGetAdsResponse
}

export const AdsState = ({ ads }: IAdsStateProps) =>
  ads && 'data' in ads ? (
    <div className={styles.grid}>
      {ads.data.map(ad => (
        <AdCard key={ad.id} ad={ad} />
      ))}
    </div>
  ) : null
