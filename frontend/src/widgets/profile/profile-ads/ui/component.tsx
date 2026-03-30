'use client'

import { AdCard, TAd } from '@entities/ad'

export interface IAdsProps {
  ads: TAd[]
  canEdit?: boolean
}

export const Ads = ({ ads, canEdit }: IAdsProps) =>
  ads.map((ad, index) => <AdCard canEdit={canEdit} key={'ad-' + index} {...ad} />)

