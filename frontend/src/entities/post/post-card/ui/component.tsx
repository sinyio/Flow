"use client";

import { Avatar, Flex, Text } from "@gravity-ui/uikit";
import {
  Eye,
  ThumbsUp,
  Comment,
  Bookmark,
  ArrowUpFromSquare,
} from "@gravity-ui/icons";
import Image from "next/image";

import type { TPost } from "@api/media";

import { Card } from "@components/templates/card";

import styles from "./component.module.css";
import Link from "next/link";
import { getDate } from "@utils/get-date";

const FLOW_AUTHOR_ID = "adminuser";

export interface IPostCardProps {
  post: TPost;
}

export const PostCard = ({ post }: IPostCardProps) => {
  const isFlowPost = !post.author || post.author.id === FLOW_AUTHOR_ID;

  return (
    <Link href={`/media/posts/${post.id}`} className={styles.link}>
      <Card className={styles.container}>
        {post.image && (
          <div className={styles.imageWrapper}>
            <Image fill alt="" src={post.image} className={styles.image} />
          </div>
        )}
        <div className={styles.body}>
          {!isFlowPost && post.author && (
            <div className={styles.meta}>
              <Flex gap={2} alignItems='center'>
                <Avatar
                  size="s"
                  imgUrl={post.author.photo ?? undefined}
                  text={post.author.fullName}
                />
                <Text variant="body-2">{post.author.fullName}</Text>
              </Flex>
              <Text variant="body-2" color="secondary">
                {getDate(post.createdAt, "short")}
              </Text>
              <div className={styles.views}>
                <Eye width={14} height={14} />
                <Text variant="body-2" color="secondary">
                  {post.viewsCount}
                </Text>
              </div>
            </div>
          )}
          <Text variant="header-2" className={styles.title}>
            {post.title}
          </Text>
        </div>
        <div className={styles.footer}>
          <div className={styles.stats}>
            {!isFlowPost && (
              <>
                <div className={styles.stat}>
                  <ThumbsUp width={14} height={14} />
                  <Text variant="body-1">{post.likesCount}</Text>
                </div>
                <div className={styles.stat}>
                  <Comment width={14} height={14} />
                  <Text variant="body-1">{post.commentsCount}</Text>
                </div>
              </>
            )}
            {isFlowPost && (
              <>
                <Text variant="body-1" color="secondary">
                  {getDate(post.createdAt, "short")}
                </Text>
                <div className={styles.stat}>
                  <Eye width={14} height={14} />
                  <Text variant="body-1">{post.viewsCount}</Text>
                </div>
              </>
            )}
            {!isFlowPost && (
              <div className={styles.stat}>
                <Bookmark width={14} height={14} />
                <Text variant="body-1">{post.favoritesCount}</Text>
              </div>
            )}
          </div>
          <div className={styles.share}>
            <ArrowUpFromSquare width={16} height={16} />
          </div>
        </div>
      </Card>
    </Link>
  );
};
