import Image from 'next/image'

import { ProfileName } from '@widgets/profile/profile-name'

import styles from './component.module.css'
import { Header } from './header'

interface ProfileHeaderProps {
  name: string
  subtitle: string
  canEdit: boolean
  userId: string
  photoUrl: string
  stats: string[]
}

export const ProfileHeader = ({
  canEdit,
  userId,
  name,
  subtitle,
  photoUrl,
  stats,
}: ProfileHeaderProps) => (
  <section className={styles.container}>
    <Image priority fill alt="" src={photoUrl} className={styles.profileImage} />

    <Header />

    <ProfileName
      canEdit={canEdit}
      userId={userId}
      name={name}
      subtitle={subtitle}
      className={styles.profileName}
      stats={stats}
    />
  </section>
)
