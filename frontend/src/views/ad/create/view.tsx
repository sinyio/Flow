'use client'

import { Button, Icon, Text } from '@gravity-ui/uikit'
import { useRouter } from 'next/navigation'

import { PageContainer } from '@components/global/page-container'
import { ArrowIcon } from '@components/svgr/arrow-icon/icon'

import { CreateAdForm } from './form/component'
import styles from './view.module.css'

export const CreateAdView = () => {
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
            onClick={() => router.push('/feed')}
          >
            <Icon data={ArrowIcon} />
          </Button>

          <Text variant="display-3" className={styles.title}>
            Новое объявление
          </Text>
        </div>

        <div className={styles.divider} />

        <CreateAdForm />
      </PageContainer>
    </>
  )
}

export default CreateAdView
