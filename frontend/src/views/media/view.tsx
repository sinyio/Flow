'use client'

import Image from 'next/image'
import { useMemo } from 'react'

import { Text, TextProps } from '@gravity-ui/uikit'

import { TPost, TGetPostsParams } from '@api/media'

import { PageContainer } from '@components/global/page-container'
import { LiquidGlassBlock } from '@components/global/liquid-glass-block'
import { useResponsive } from '@utils/hooks/use-responsive'

import { MediaSearch } from '@widgets/media'

import { PostsState } from './states/posts/component'
import { MainState } from './states/main/component'
import styles from './view.module.css'

export interface IMediaViewProps {
  flowPosts?: TPost[]
  userPosts?: TPost[]
  searchPosts?: TPost[]
  settings?: TGetPostsParams
}

export const MediaView = ({ flowPosts, userPosts, searchPosts, settings }: IMediaViewProps) => {
  const { device } = useResponsive()
  const headerText = useMemo(
    () => ({ mobile: 'display-1', tablet: 'display-2', desktop: 'display-3' })[device],
    [device]
  ) as TextProps['variant']

  return (
    <>
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <Image
            fill
            priority
            src="/media-hero.webp"
            alt=""
            className={styles.heroImage}
            aria-hidden="true"
          />
          <LiquidGlassBlock className={styles.heroCard}>
            <Text variant={headerText} className={styles.heroTitle} as="h1">
              Медиа флоу
            </Text>
          </LiquidGlassBlock>
        </div>
      </div>

      <MediaSearch />

      <PageContainer inner={{ className: styles.pageInner }}>
        {settings ? (
          <PostsState posts={searchPosts} />
        ) : (
          <MainState flowPosts={flowPosts} userPosts={userPosts} />
        )}
      </PageContainer>
    </>
  )
}

export default MediaView
