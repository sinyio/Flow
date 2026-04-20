'use client'

import { Text } from '@gravity-ui/uikit'

import { TPost } from '@api/media'
import { PostCard } from '@entities/post'

import styles from './component.module.css'

export interface IPostsStateProps {
  posts?: TPost[]
}

export const PostsState = ({ posts = [] }: IPostsStateProps) => {
  if (!posts.length) {
    return (
      <Text variant="body-2" color="secondary">
        Ничего не найдено
      </Text>
    )
  }

  return (
    <div className={styles.grid}>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
