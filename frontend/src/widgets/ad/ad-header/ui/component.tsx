import Image from 'next/image'

import styles from './component.module.css'

import { Header } from '@widgets/profile/profile-header'
import { AdName } from '@widgets/ad/ad-name'

export interface IAdHeaderProps {
  imageUrl: string
  title: string
  price: number
  authorName: string
  authorAvatarUrl?: string
}

export const AdHeader = ({
  imageUrl,
  title,
  price,
  authorName,
  authorAvatarUrl,
}: IAdHeaderProps) => (
  <section className={styles.container}>
    <Image priority fill alt="" src={imageUrl} className={styles.coverImage} />

    <Header />

    <AdName
      title={title}
      price={price}
      authorName={authorName}
      authorAvatarUrl={authorAvatarUrl}
      className={styles.adName}
    />
  </section>
)
