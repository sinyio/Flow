import { AdCard, TAd } from '@entities/ad'

export interface IAdsProps {
  ads: TAd[]
}

export const Ads = ({ ads }: IAdsProps) =>
  ads.map((ad, index) => <AdCard key={'ad-' + index} ad={ad} />)
