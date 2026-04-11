import { Text } from '@gravity-ui/uikit'

import { TGetAdsParams } from '@api/ads'

export interface IStaticStateProps {
  settings: TGetAdsParams
}

export const StaticState = ({ settings }: IStaticStateProps) => (
  <>
    <Text variant="header-1">
      {settings.fromCity} - {settings.toCity}
    </Text>
    <Text variant="subheader-1">
      {settings.startDate} - {settings.endDate}
    </Text>
    <Text variant="subheader-1">{settings.minPrice}</Text>
  </>
)
