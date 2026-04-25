import Image from 'next/image'

import { AdName } from '@widgets/ad/ad-name'
import { Header } from '@widgets/profile/profile-header'

import styles from './component.module.css'

export interface IAdHeaderProps {
  imageUrl: string
  title: string
  price: number
  authorName: string
  authorAvatarUrl?: string
  adId?: string
  canEdit?: boolean
  responseCount?: number
  onDeleteAd?: () => void
}

export const AdHeader = ({
  imageUrl,
  title,
  price,
  authorName,
  authorAvatarUrl,
  adId,
  canEdit,
  responseCount,
  onDeleteAd,
}: IAdHeaderProps) => (
  <section className={styles.container}>
    <Image priority fill alt="" src={imageUrl} className={styles.coverImage} />

    <Header canEdit={canEdit} adId={adId} onDeleteAd={onDeleteAd} />

    <AdName
      title={title}
      price={price}
      authorName={authorName}
      authorAvatarUrl={authorAvatarUrl}
      adId={adId}
      canEdit={canEdit}
      responseCount={responseCount}
      className={styles.adName}
    />
  </section>
)
