'use client'

import { Button, Flex, Text } from '@gravity-ui/uikit'
import { useRouter } from 'next/navigation'

import { TPost } from '@api/media'
import { useResponsive } from '@utils/hooks/use-responsive'
import { PostCard } from '@entities/post'

import styles from './component.module.css'

export interface IMainStateProps {
  flowPosts?: TPost[]
  userPosts?: TPost[]
}

export const MainState = ({ flowPosts = [], userPosts = [] }: IMainStateProps) => {
  const { device } = useResponsive()
  const router = useRouter()
  const isFullWidth = device === 'mobile'

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <Text variant="display-3" className={styles.sectionTitle} as="h2">
          От флоу
        </Text>
        <div className={styles.mediaCards}>
          {flowPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        <Button view="action" size="xl" width={isFullWidth ? 'max' : 'auto'} onClick={() => router.push('/media?filter=flow')}>
          <Text variant="header-1">Загрузить еще</Text>
        </Button>
      </section>

      <section className={styles.section}>
        <Text variant="display-3" as="h2" className={styles.sectionTitle}>
          Истории пользователей
        </Text>
        <div className={styles.mediaCards}>
          {userPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        <Button view="action" size="xl" width={isFullWidth ? 'max' : 'auto'} onClick={() => router.push('/media?filter=users')}>
          <Text variant="header-1">Загрузить еще</Text>
        </Button>
      </section>

      <section className={styles.section}>
        <Flex alignItems="center" direction="column" gap={4}>
          <Text variant="display-3" as="h2">
            Хотите поделиться своим опытом?
          </Text>
          <Text variant="body-3">
            Расскажите свою историю, чтобы больше пользователей узнали о Флоу.
          </Text>
          <Button view="action" size="xl" width={isFullWidth ? 'max' : 'auto'} onClick={() => router.push('/media/posts/new')}>
            <Text variant="header-1">Написать пост</Text>
          </Button>
        </Flex>
      </section>
    </div>
  )
}
