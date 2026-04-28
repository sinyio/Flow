"use client";

import { useState } from "react";
import { Avatar, Text } from "@gravity-ui/uikit";
import {
  Eye,
  ThumbsUp,
  Comment,
  Bookmark,
  ArrowUpFromSquare,
} from "@gravity-ui/icons";
import Image from "next/image";
import Link from "next/link";

import type { TPost } from "@api/media";

import { Card } from "@components/templates/card";
import { ShareModal } from "@components/molecules/share-modal";

import styles from "./component.module.css";
import { getDate } from "@utils/get-date";

const FLOW_AUTHOR_ID = "adminuser";

export interface IPostCardProps {
  post: TPost;
}

export const PostCard = ({ post }: IPostCardProps) => {
  const isFlowPost = !post.author || post.author.id === FLOW_AUTHOR_ID;
  const [shareOpen, setShareOpen] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShareOpen(true);
  };

  return (
    <>
      <Link href={`/media/posts/${post.id}`} className={styles.link}>
        <Card className={styles.container}>
          {post.image && (
            <div className={styles.imageWrapper}>
              <Image fill alt="" src={post.image + (post.updatedAt ? `?v=${new Date(post.updatedAt).getTime()}` : '')} className={styles.image} />
            </div>
          )}
          <div className={styles.body}>
            {!isFlowPost && post.author && (
              <div className={styles.meta}>
                <div className={styles.authorMeta}>
                  <Avatar
                    size="s"
                    imgUrl={post.author.photo ?? undefined}
                    text={post.author.fullName}
                  />
                  <div className={styles.authorName}>
                    <Text variant="body-2">{post.author.fullName}</Text>
                  </div>
                </div>
                <Text variant="body-2" color="secondary" style={{ flexShrink: 0 }}>
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
            <div className={styles.share} onClick={handleShare}>
              <ArrowUpFromSquare width={16} height={16} />
            </div>
          </div>
        </Card>
      </Link>
      <ShareModal
        open={shareOpen}
        onOpenChange={setShareOpen}
        url={`${typeof window !== 'undefined' ? window.location.origin : ''}/media/posts/${post.id}`}
        title="Поделиться постом"
      />
    </>
  );
};
