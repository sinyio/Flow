'use client'

import { Avatar, Button, Icon, Text } from '@gravity-ui/uikit'

import { TUser } from '@api/user/get-user'
import { SettingsForm } from './form/component'
import { ArrowIcon } from '@components/svgr/arrow-icon/icon'
import { Pen2Icon } from '@components/svgr/pen-2-icon/icon'
import styles from './view.module.css'
import { useResponsive } from '@utils/hooks/use-responsive'

export interface IProfileViewProps {
  user?: TUser
}

const ProfileSettings = ({ user }: IProfileViewProps) => {
  const { device } = useResponsive()

  return (
    <>
      <div className={styles.gap} />
      <section className={styles.page}>
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

        <SettingsForm />
      </section>
    </>
  )
}

export default ProfileSettings
