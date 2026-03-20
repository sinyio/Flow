'use client'

import Image from 'next/image'
import { Button, DropdownMenu, Icon } from '@gravity-ui/uikit'

import styles from './component.module.css'
import { ArrowIcon } from '@components/svgr/arrow-icon/icon'
import { DotsIcon } from '@components/svgr/dots-icon/icon'
import { VerifiedIcon } from '@components/svgr/verified-icon/icon'
import { ProfileStats } from '../profile-stats/component'
import { Typography } from '@components/typography/component'
import { FlagIcon } from '@components/svgr/flag-icon/icon'
import { ShareIcon } from '@components/svgr/share-icon/icon'

interface ProfileHeaderProps {
  name: string
  subtitle: string
}

export const ProfileHeader = ({ name, subtitle }: ProfileHeaderProps) => {
  const handleClick = () => {}

  return (
    <section className={styles.container}>
      <Image priority fill alt="" src="/profile/profile-head.png" className={styles.profileImage} />

      <div className={styles.header}>
        <Button view="normal" size="l">
          <Icon data={ArrowIcon} />
        </Button>
        <DropdownMenu
          size="l"
          popupProps={{ placement: 'bottom-end', offset: 8, style: { width: '200px' } }}
          renderSwitcher={props => (
            <Button {...props} view="normal" size="l">
              <Icon data={DotsIcon} />
            </Button>
          )}
          items={[
            {
              iconStart: <FlagIcon />,
              text: <Typography variant="body1">Пожаловаться</Typography>,
              action: () => console.log('123'),
            },
            {
              iconStart: <ShareIcon />,
              text: <Typography variant="body1">Поделиться</Typography>,
              action: () => console.log('123'),
            },
          ]}
        />
      </div>

      <div className={styles.info}>
        <div className={styles.nameRow}>
          <Typography variant="display3" className={styles.name}>
            {name}
          </Typography>
          <Typography variant="body3" className={styles.roleRow}>
            <Icon data={VerifiedIcon} />
            <span className={styles.subtitle}>{subtitle}</span>
          </Typography>
        </div>

        <Button size="xl" view="action" className={styles.messageButton} onClick={handleClick}>
          Написать
        </Button>

        <ProfileStats
          stats={[{ label: '2 отзыва' }, { label: '4 доставки' }, { label: '1 объявление' }]}
        />
      </div>
    </section>
  )
}
