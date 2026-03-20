import { IAdsProps } from './types'
import { AdCard } from '../ad-card/component'

export const Ads = ({ ads }: IAdsProps) =>
  ads.map((ad, index) => <AdCard key={'ad-' + index} {...ad} />)
