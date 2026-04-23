import Image from 'next/image';
import { Text } from '@gravity-ui/uikit';

import styles from './main-card.module.css';

interface MainCardProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt?: string;
}

export function MainCard({ title, description, imageSrc, imageAlt = '' }: MainCardProps) {
  return (
    <div className={styles.card}>
      <Image src={imageSrc} alt={imageAlt} fill className={styles.image} />
      <div className={styles.textBlock}>
        <Text variant="display-4" as="h3">{title}</Text>
        <Text variant="subheader-3" className={styles.description}>{description}</Text>
      </div>
    </div>
  );
}
