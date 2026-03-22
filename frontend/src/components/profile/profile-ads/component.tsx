import { AdCard } from '../ad-card/component'
import { TAd } from '../ad-card/types'

export interface IAdsProps {
  ads: TAd[]
  canEdit?: boolean
}

export const Ads = ({ ads, canEdit }: IAdsProps) =>
  ads.map((ad, index) => <AdCard canEdit={canEdit} key={'ad-' + index} {...ad} />)
