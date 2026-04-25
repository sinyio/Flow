import { Text } from '@gravity-ui/uikit'

import { TGetAdsParams } from '@api/ads'

import { getDate } from '@utils/get-date'

import styles from './component.module.css'

export interface IStaticStateProps {
  settings: TGetAdsParams
}

export const StaticState = ({ settings }: IStaticStateProps) => (
  <div className={styles.container}>
    <Text variant="display-3" className={styles.text}>
      {settings.fromCity} – {settings.toCity}
    </Text>

    {(settings.startDate || settings.endDate) && (
      <Text variant="header-2" className={styles.text}>
        {settings.startDate && settings.endDate
          ? `${getDate(settings.startDate, 'regular')} – ${getDate(settings.endDate, 'regular')}`
          : settings.startDate
            ? `ОТ ${getDate(settings.startDate, 'regular')}`
            : `До ${getDate(settings.endDate, 'regular')}`}
      </Text>
    )}

    {settings.minPrice && (
      <Text variant="header-2" className={styles.text}>
        от {settings.minPrice} ₽
      </Text>
    )}
  </div>
)
