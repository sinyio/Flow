'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button, Icon, Text } from '@gravity-ui/uikit'
import { useRouter } from 'next/navigation'

import { ArrowIcon } from '@components/svgr/arrow-icon/icon'
import { TPost, TPaginationMeta, TMediaPostFilter, TMediaPostSort, getPosts } from '@api/media'
import { PostCard } from '@entities/post'

import styles from './component.module.css'

export interface IPostsStateProps {
  posts?: TPost[]
  meta?: TPaginationMeta
  filter?: TMediaPostFilter
  sort?: TMediaPostSort
  search?: string
}

export const PostsState = ({ posts = [], meta, filter, sort, search }: IPostsStateProps) => {
  const router = useRouter()
  const [list, setList] = useState<TPost[]>(posts)
  const [page, setPage] = useState(1)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const loadingRef = useRef(false)
  const pageRef = useRef(1)

  useEffect(() => {
    setList(posts)
    setPage(1)
    pageRef.current = 1
  }, [posts])

  const hasMore = meta ? page < meta.pages : false

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !meta || pageRef.current >= meta.pages) return
    loadingRef.current = true
    try {
      const nextPage = pageRef.current + 1
      const res = await getPosts({ filter, sort, search, page: nextPage, limit: meta.limit })
      const resData = res.data
      if ('data' in resData) {
        setList(prev => [...prev, ...resData.data])
        pageRef.current = nextPage
        setPage(nextPage)
      }
    } finally {
      loadingRef.current = false
    }
  }, [filter, sort, search, meta])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          void loadMore()
        }
      },
      { rootMargin: '300px' }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [loadMore])

  if (!list.length) {
    return (
      <Text variant="body-2" color="secondary">
        Ничего не найдено
      </Text>
    )
  }

  const title = !search && (filter === 'flow' ? 'От флоу' : filter === 'users' ? 'Истории пользователей' : undefined)

  return (
    <>
      {title && (
        <div className={styles.titleRow}>
          <Button view="normal" size="l" onClick={() => router.push('/media')}>
            <Icon data={ArrowIcon} size={20} />
          </Button>
          <Text variant="display-3" as="h2" className={styles.title}>{title}</Text>
        </div>
      )}
      <div className={styles.grid}>
        {list.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      {hasMore && <div ref={sentinelRef} />}
    </>
  )
}
