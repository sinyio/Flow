'use client'

import { Avatar, Text } from '@gravity-ui/uikit'
import { Eye, Heart, Comment, Star } from '@gravity-ui/icons'
import Image from 'next/image'

import type { TPost } from '@api/media'

import { Card } from '@components/templates/card'

import styles from './component.module.css'
import Link from 'next/link'
import { getDate } from '@utils/get-date'

const FLOW_AUTHOR_ID = 'adminuser'

export interface IPostCardProps {
  post: TPost
}

export const PostCard = ({ post }: IPostCardProps) => {
  const isFlowPost = !post.author || post.author.id === FLOW_AUTHOR_ID

  return (
    <Link href={`/media/posts/${post.id}`} className={styles.link}>
      <Card className={styles.container}>
        {post.image && (
          <div className={styles.imageWrapper}>
            <Image fill alt="" src={post.image} className={styles.image} />
          </div>
        )}
        <div className={styles.body}>
          <Text variant="header-2" className={styles.title}>
            {post.title}
          </Text>
          <div className={styles.meta}>
            <Text variant="body-2" color="secondary">
              {getDate(post.createdAt, "regular")}
            </Text>
            <div className={styles.views}>
              <Eye width={14} height={14} />
              <Text variant="body-2" color="secondary">
                {post.viewsCount}
              </Text>
            </div>
          </div>
        </div>
        {!isFlowPost && post.author && (
          <div className={styles.footer}>
            <div className={styles.author}>
              <Avatar size="s" imgUrl={post.author.photo ?? undefined} text={post.author.fullName} />
              <Text variant="body-2">{post.author.fullName}</Text>
            </div>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <Heart width={14} height={14} />
                <Text variant="caption-2">{post.likesCount}</Text>
              </div>
              <div className={styles.stat}>
                <Comment width={14} height={14} />
                <Text variant="caption-2">{post.commentsCount}</Text>
              </div>
              <div className={styles.stat}>
                <Star width={14} height={14} />
                <Text variant="caption-2">{post.favoritesCount}</Text>
              </div>
            </div>
          </div>
        )}
      </Card>
    </Link>
  )
}
