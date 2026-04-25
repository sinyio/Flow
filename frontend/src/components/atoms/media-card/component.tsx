import { Text } from '@gravity-ui/uikit'
import Image from 'next/image'

import styles from './component.module.css'

export interface IMediaCardProps {
  imageUrl: string
  title: string
}

export const MediaCard = ({ imageUrl, title }: IMediaCardProps) => (
  <div className={styles.container}>
    <Image fill src={imageUrl} alt="" className={styles.image} />
    <div className={styles.textBlock}>
      <Text variant="header-2" className={styles.title}>{title}</Text>
    </div>
  </div>
)
