'use client'

import { Avatar, Button, Icon, Text } from '@gravity-ui/uikit'

import { TUser } from '@api/user/get-user'

import { useResponsive } from '@utils/hooks/use-responsive'

import { PageContainer } from '@components/global/page-container'
import { Pen2Icon } from '@components/svgr/pen-2-icon/icon'

import { SettingsForm } from './form/component'
import styles from './view.module.css'

export interface IProfileViewProps {
  user: TUser
}

const ProfileSettings = ({ user }: IProfileViewProps) => {
  const { device } = useResponsive()

  return (
    <>
      <div className={styles.gap} />
      <PageContainer inner={{ className: styles.page }}>
        <div className={styles.topRow}>
          <Text variant="display-1" className={styles.title}>
            Настройки профиля
          </Text>

          {device !== 'mobile' && <div className={styles.divider} />}

          <div className={styles.avatarWrap}>
            <Avatar withImageBorder size="xl" imgUrl={user?.photo || '/profile/avatar.png'} />
            <Button
              view="normal"
              size="l"
              className={styles.editAvatarButton}
              aria-label="Изменить фото профиля"
            >
              <Icon data={Pen2Icon} />
            </Button>
          </div>
        </div>

        <SettingsForm user={user} />
      </PageContainer>
    </>
  )
}

export default ProfileSettings
