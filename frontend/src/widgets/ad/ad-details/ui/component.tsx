import { Text } from '@gravity-ui/uikit'

import { TAd } from '@api/ads'

import { getDate } from '@utils/get-date'
import { getPackageType } from '@utils/get-package-type'

import { Stats } from '@components/stats'

import styles from './component.module.css'

export interface IAdHeaderProps {
  ad: TAd
}

export const AdDetails = ({ ad }: IAdHeaderProps) => {
  const list = [
    { label: 'Вес', value: ad.weight },
    { label: 'Габариты', value: `${ad.height}x${ad.width}x${ad.length} см` },
    { label: 'Упаковка', value: getPackageType(ad.packaging) },
    { label: 'Хрупкое', value: ad.isFragile ? 'Да' : 'Нет' },
    { label: 'Документы', value: ad.isDocument ? 'Да' : 'Нет' },
  ]

  const stats = [`${ad.fromCity} - ${ad.toCity}`, `${getDate(ad.endDate, 'before')}`]

  return (
    <div className={styles.adDetails}>
      <div className={styles.adDescriptionBlock}>
        <Text variant="display-1">Описание</Text>
        <Text variant="body-3" color="secondary" className={styles.adDescriptionText}>
          {ad.description}
        </Text>
      </div>

      <Stats
        stats={stats}
        labelProps={{ size: 'm', theme: 'normal', className: styles.statsContainer }}
        textProps={{ className: styles.statsChip }}
      />

      <div className={styles.adMetaGrid}>
        {list.map(item => (
          <div key={item.label} className={styles.adMetaRow}>
            <Text variant="body-2" color="secondary" className={styles.adMetaLabel}>
              {item.label}
            </Text>
            <div className={styles.dashedLine} />
            <Text variant="body-2" className={styles.adMetaValue}>
              {item.value}
            </Text>
          </div>
        ))}
      </div>
    </div>
  )
}
