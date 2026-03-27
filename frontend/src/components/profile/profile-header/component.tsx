import Image from 'next/image'

import styles from './component.module.css'
import { Header } from './header/component'
import { ProfileName } from '../profile-name/component'

interface ProfileHeaderProps {
  name: string
  subtitle: string
  canEdit: boolean
}

export const ProfileHeader = ({ canEdit, name, subtitle }: ProfileHeaderProps) => (
  <section className={styles.container}>
    <Image priority fill alt="" src="/profile/profile-head.png" className={styles.profileImage} />

    <Header />

    <ProfileName canEdit={canEdit} name={name} subtitle={subtitle} className={styles.profileName} />
  </section>
)
