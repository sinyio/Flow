"use client";

import { useState, useEffect, use, useRef } from "react";

import { Avatar, Text } from "@gravity-ui/uikit";
import { Eye } from "@gravity-ui/icons";

import { TPost } from "@api/media";
import { getPostById } from "@api/media/get-post-by-id";
import { addPostView } from "@api/media/add-post-view";
import { useApiContext } from "@contexts/api-context";

import { PageContainer } from "@components/global/page-container";

import styles from "./page.module.css";
import { getDate } from "@utils/get-date";
import { PostHeader } from "@widgets/media";

const FLOW_AUTHOR_ID = "adminuser";

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = use(params);
  const { apiClient } = useApiContext();

  const [post, setPost] = useState<TPost | null>(null);
  const [loading, setLoading] = useState(true);
  const viewAdded = useRef(false);

  useEffect(() => {
    getPostById(id, apiClient)
      .then((res) => {
        const data = res.data;
        if ("id" in data) {
          setPost(data as TPost);
        }
      })
      .finally(() => setLoading(false));

    if (!viewAdded.current) {
      viewAdded.current = true;
      addPostView(id, apiClient).catch(() => {});
    }
  }, [id, apiClient]);

  if (loading) {
    return (
      <PageContainer>
        <div className={styles.loading}>
          <Text variant="body-2" color="secondary">
            Загрузка...
          </Text>
        </div>
      </PageContainer>
    );
  }

  if (!post) {
    return (
      <PageContainer>
        <div className={styles.notFound}>
          <Text variant="body-2" color="secondary">
            Пост не найден
          </Text>
        </div>
      </PageContainer>
    );
  }

  return (
    <>
      {post.image && (
        <PostHeader photoUrl={post.image} postId={post.id} />
      )}
      <PageContainer inner={{ className: styles.pageInner }}>
        <div className={styles.content}>
          <Text variant="header-1" className={styles.title}>
            {post.title}
          </Text>

          <div className={styles.meta}>
            {post.author && post.author.id !== FLOW_AUTHOR_ID && (
              <>
                <Avatar
                  size="s"
                  imgUrl={post.author.photo ?? undefined}
                  text={post.author.fullName}
                />
                <Text variant="body-2">{post.author.fullName}</Text>
              </>
            )}
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

          {post.content && (
            <div className={styles.textContent}>
              <Text variant="body-1">{post.content}</Text>
            </div>
          )}
        </div>
      </PageContainer>
    </>
  );
}
