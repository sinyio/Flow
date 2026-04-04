import { Text } from '@gravity-ui/uikit'

import { TRoute } from '@api/ads'

import { getNoun } from '@utils/get-noun'

import { LocationIcon } from '@components/svgr/location-icon/icon'

import styles from './component.module.css'

export interface IRouteProps {
  route: TRoute
}

export const Route = ({ route }: IRouteProps) => (
  <div role="button" className={styles.container}>
    <div className={styles.routeCircle}>
      <LocationIcon />
    </div>
    <div className={styles.textContainer}>
      <Text variant="header-1" color="complementary">
        {route.fromCity} - {route.toCity}
      </Text>
      <Text variant="body-2" color="secondary">
        {getNoun(route.totalAds, 'объявление', 'объявления', 'объявлений')}
      </Text>
    </div>
  </div>
)
