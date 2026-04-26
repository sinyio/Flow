'use client'

import { Avatar, Button, Icon, Text } from '@gravity-ui/uikit'
import { useEffect, useRef, useState } from 'react'

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

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [photo, setPhoto] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!photo) {
      setPreviewUrl(null)

      return
    }

    const url = URL.createObjectURL(photo)

    setPreviewUrl(url)

    return () => URL.revokeObjectURL(url)
  }, [photo])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) setPhoto(file)
    e.target.value = ''
  }

  const avatarUrl = previewUrl || user?.photo || '/profile/avatar.png'

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
            <Avatar withImageBorder size="xl" imgUrl={avatarUrl} />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className={styles.hiddenInput}
              onChange={handleFileChange}
            />
            <Button
              view="normal"
              size="l"
              className={styles.editAvatarButton}
              aria-label="Изменить фото профиля"
              onClick={() => fileInputRef.current?.click()}
            >
              <Icon data={Pen2Icon} />
            </Button>
          </div>
        </div>

        <SettingsForm user={user} photo={photo} onPhotoSubmitted={() => setPhoto(null)} />
      </PageContainer>
    </>
  )
}

export default ProfileSettings
