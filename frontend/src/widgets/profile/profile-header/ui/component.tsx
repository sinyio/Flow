import Image from 'next/image'

import { ProfileName } from '@widgets/profile/profile-name'

import styles from './component.module.css'
import { Header } from './header'

interface ProfileHeaderProps {
  name: string
  subtitle: string
  canEdit: boolean
  photoUrl: string
  stats: string[]
}

export const ProfileHeader = ({ canEdit, name, subtitle, photoUrl, stats }: ProfileHeaderProps) => (
  <section className={styles.container}>
    <Image priority fill alt="" src={photoUrl} className={styles.profileImage} />

    <Header />

    <ProfileName
      canEdit={canEdit}
      name={name}
      subtitle={subtitle}
      className={styles.profileName}
      stats={stats}
    />
  </section>
)
