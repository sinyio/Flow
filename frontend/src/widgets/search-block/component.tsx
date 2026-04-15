import { TGetAdsParams, TGetPopularRoutesResponse } from '@api/ads'

import { LiquidGlassBlock } from '@components/global/liquid-glass-block'

import styles from './component.module.css'
import SearchState from './states/search/component'
import { StaticState } from './states/static/component'

export interface IHeroSearchProps {
  routes?: TGetPopularRoutesResponse
  settings?: TGetAdsParams
}

export const HeroSearch = ({ routes, settings }: IHeroSearchProps) => (
  <LiquidGlassBlock className={styles.heroCard}>
    {settings ? <StaticState settings={settings} /> : <SearchState routes={routes} />}
  </LiquidGlassBlock>
)
