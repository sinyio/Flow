'use client'

import Image from 'next/image'
import { Button, Icon } from '@gravity-ui/uikit'

import styles from './component.module.css'
import { ArrowIcon } from '@components/svgr/arrow-icon/icon'
import { DotsIcon } from '@components/svgr/dots-icon/icon'
import { VerifiedIcon } from '@components/svgr/verified-icon/icon'

interface ProfileHeaderProps {
  name: string
  subtitle: string
  onMessage?: () => void
}

export const ProfileHeader = ({ name, subtitle, onMessage }: ProfileHeaderProps) => (
  <section className={styles.root}>
    <div className={styles.hero}>
      <Image priority fill alt="" src="/profile/profile-head.png" className={styles.heroImage} />

      <div className={styles.heroActions}>
        <Button view="normal" size="l">
          <Icon data={ArrowIcon} />
        </Button>
        <Button view="normal" size="l">
          <Icon data={DotsIcon} />
        </Button>
      </div>
    </div>

    <div className={styles.info}>
      <h1 className={styles.name}>{name}</h1>
      <div className={styles.roleRow}>
        <Icon data={VerifiedIcon} />
        <span className={styles.subtitle}>{subtitle}</span>
      </div>

      <Button size="xl" view="action" className={styles.messageButton} onClick={onMessage}>
        Написать
      </Button>
    </div>
  </section>
)
