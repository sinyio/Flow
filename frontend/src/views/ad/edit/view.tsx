'use client'

import { Button, Icon, Text } from '@gravity-ui/uikit'
import { useRouter } from 'next/navigation'

import { type TAd } from '@api/ads'

import { PageContainer } from '@components/global/page-container'
import { ArrowIcon } from '@components/svgr/arrow-icon/icon'

import { EditAdForm } from './form/component'
import styles from './view.module.css'

interface IEditAdViewProps {
  ad: TAd
}

export const EditAdView = ({ ad }: IEditAdViewProps) => {
  const router = useRouter()

  return (
    <>
      <div className={styles.gap} />

      <PageContainer inner={{ className: styles.page }}>
        <div className={styles.headerRow}>
          <Button
            view="normal"
            size="l"
            className={styles.backButton}
            aria-label="Назад"
            onClick={() => router.push(`/ads/${ad.id}`)}
          >
            <Icon data={ArrowIcon} />
          </Button>

          <Text variant="display-3" className={styles.title}>
            Редактировать объявление
          </Text>
        </div>

        <div className={styles.divider} />

        <EditAdForm ad={ad} />
      </PageContainer>
    </>
  )
}

export default EditAdView
