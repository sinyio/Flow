"use client";

import { useState, useEffect, use, useRef } from "react";

import { Avatar, Button, Text } from "@gravity-ui/uikit";
import {
  Eye,
  ThumbsUp,
  ThumbsUpFill,
  Bookmark,
  BookmarkFill,
} from "@gravity-ui/icons";

import { TPost, TMediaComment } from "@api/media";
import { getPostById } from "@api/media/get-post-by-id";
import { getPostComments } from "@api/media/get-post-comments";
import { addPostView } from "@api/media/add-post-view";
import { togglePostLike } from "@api/media/toggle-post-like";
import { togglePostFavorite } from "@api/media/toggle-post-favorite";
import { toggleCommentLike } from "@api/media/toggle-comment-like";
import { createComment } from "@api/media/create-comment";
import { deleteComment } from "@api/media/delete-comment";
import { me } from "@api/auth/me";
import { useApiContext } from "@contexts/api-context";

import { PageContainer } from "@components/global/page-container";

import styles from "./page.module.css";
import { getDate } from "@utils/get-date";
import { PostHeader } from "@widgets/media";
import { CommentCard, CommentInput } from "@entities/comment";
import { Modal } from "src/ui-kit";

const FLOW_AUTHOR_ID = "adminuser";

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = use(params);
  const { apiClient } = useApiContext();

  const [post, setPost] = useState<TPost | null>(null);
  const [comments, setComments] = useState<TMediaComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();
  const [replyTo, setReplyTo] = useState<string | undefined>();
  const [replyToCommentId, setReplyToCommentId] = useState<
    string | undefined
  >();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const viewAdded = useRef(false);

  useEffect(() => {
    me(apiClient)
      .then((res) => {
        const data = res.data;
        if ("userId" in data) {
          setCurrentUserId(data.userId);
        }
      })
      .catch(() => {});
  }, [apiClient]);

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

  const isFlowPost = !post?.author || post.author.id === FLOW_AUTHOR_ID;

  useEffect(() => {
    if (!post || isFlowPost) return;
    setCommentsLoading(true);
    getPostComments({ id: post.id, limit: 100 }, apiClient)
      .then((res) => {
        const data = res.data;
        if ("data" in data && Array.isArray(data.data)) {
          setComments(data.data);
        }
      })
      .finally(() => setCommentsLoading(false));
  }, [post?.id, isFlowPost, id, apiClient]);

  const handleLike = () => {
    if (!post) return;
    togglePostLike(post.id, apiClient).then(() => {
      setPost((prev) =>
        prev
          ? {
              ...prev,
              isLiked: !prev.isLiked,
              likesCount: prev.isLiked
                ? prev.likesCount - 1
                : prev.likesCount + 1,
            }
          : null,
      );
    });
  };

  const handleFavorite = () => {
    if (!post) return;
    togglePostFavorite(post.id, apiClient).then(() => {
      setPost((prev) =>
        prev
          ? {
              ...prev,
              isFavorite: !prev.isFavorite,
              favoritesCount: prev.isFavorite
                ? prev.favoritesCount - 1
                : prev.favoritesCount + 1,
            }
          : null,
      );
    });
  };

  const handleCommentLike = (commentId: string) => {
    toggleCommentLike(commentId, apiClient).then(() => {
      setComments((prev) => {
        const updateLikes = (comments: TMediaComment[]): TMediaComment[] =>
          comments?.map((c) => {
            if (c.id === commentId) {
              return {
                ...c,
                isLiked: !c.isLiked,
                likesCount: c.isLiked ? c.likesCount - 1 : c.likesCount + 1,
              };
            }
            return { ...c, replies: updateLikes(c.replies) };
          });
        return updateLikes(prev);
      });
    });
  };

  const handleCommentSubmit = (text: string) => {
    if (!text.trim()) return;

    createComment(
      {
        id,
        text,
        parentId: replyToCommentId,
      },
      apiClient,
    )
      .then((res) => {
        const data = res.data;

        if ("comment" in data) {
          const newComment = data.comment;

          if (replyToCommentId) {
            setComments((prev) => {
              const addReply = (comments: TMediaComment[]): TMediaComment[] =>
                comments.map((c) => {
                  if (
                    c.id === replyToCommentId ||
                    c.id === newComment.parentId
                  ) {
                    return {
                      ...c,
                      replies: [...(c.replies || []), newComment],
                    };
                  }
                  return { ...c, replies: addReply(c.replies || []) };
                });
              return addReply(prev);
            });
          } else {
            setComments((prev) => [newComment, ...prev]);
          }

          setPost((prev) =>
            prev ? { ...prev, commentsCount: prev.commentsCount + 1 } : null,
          );
        } else {
          getPostComments({ id, limit: 100 }, apiClient).then((res) => {
            const data = res.data;
            if ("data" in data && Array.isArray(data.data)) {
              setComments(data.data);
            }
          });
        }

        setReplyTo(undefined);
        setReplyToCommentId(undefined);
      })
      .catch(() => {});
  };

  const handleReply = (commentId: string, authorName: string) => {
    setReplyTo(authorName);
    setReplyToCommentId(commentId);
  };

  const handleCancelReply = () => {
    setReplyTo(undefined);
    setReplyToCommentId(undefined);
  };

  const handleDeleteComment = (commentId: string) => {
    setCommentToDelete(commentId);
    setDeleteModalOpen(true);
  };

  const confirmDeleteComment = () => {
    if (!commentToDelete) return;

    deleteComment(commentToDelete, apiClient)
      .then(() => {
        setComments((prev) => {
          const removeComment = (comments: TMediaComment[]): TMediaComment[] =>
            comments
              .filter((c) => c.id !== commentToDelete)
              .map((c) => ({
                ...c,
                replies: removeComment(c.replies || []),
              }));
          return removeComment(prev);
        });
        setPost((prev) =>
          prev
            ? { ...prev, commentsCount: Math.max(0, prev.commentsCount - 1) }
            : null,
        );
      })
      .catch(() => {})
      .finally(() => {
        setDeleteModalOpen(false);
        setCommentToDelete(null);
      });
  };

  const cancelDeleteComment = () => {
    setDeleteModalOpen(false);
    setCommentToDelete(null);
  };

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
      {post.image && <PostHeader photoUrl={post.image} postId={post.id} />}
      <PageContainer inner={{ className: styles.pageInner }}>
        <div className={styles.content}>
          <Text variant="header-1" className={styles.title}>
            {post.title}
          </Text>

          <div className={styles.meta}>
            {post.author && !isFlowPost && (
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

          <Modal open={deleteModalOpen} onOpenChange={cancelDeleteComment}>
            <div className={styles.deleteModal}>
              <Text variant="header-2">Удалить комментарий?</Text>
              <Text variant="body-1" color="secondary">
                Это действие нельзя отменить.
              </Text>
              <div className={styles.deleteModalActions}>
                <Button view="flat" onClick={cancelDeleteComment}>
                  Отмена
                </Button>
                <Button view="action" onClick={confirmDeleteComment}>
                  Удалить
                </Button>
              </div>
            </div>
          </Modal>
          <div className={styles.stats}>
            {!isFlowPost && (
              <div className={styles.stat} onClick={handleLike}>
                <div>
                  {post.isLiked ? (
                    <ThumbsUpFill width={16} height={16} />
                  ) : (
                    <ThumbsUp width={16} height={16} />
                  )}
                </div>
                <Text variant="body-2">{post.likesCount}</Text>
              </div>
            )}
            <div className={styles.stat} onClick={handleFavorite}>
              <div>
                {post.isFavorite ? (
                  <BookmarkFill width={16} height={16} />
                ) : (
                  <Bookmark width={16} height={16} />
                )}
              </div>
              <Text variant="body-2">{post.favoritesCount}</Text>
            </div>
          </div>
        </div>

        {!isFlowPost && (
          <div className={styles.commentsSection}>
            <Text variant="header-2" className={styles.commentsTitle}>
              {post.commentsCount} комментариев
            </Text>

            <div className={styles.commentsList}>
              {comments.map((comment) => (
                <>
                  <CommentCard
                    key={comment.id}
                    comment={comment}
                    onLike={handleCommentLike}
                    onReply={handleReply}
                    onDelete={handleDeleteComment}
                    currentUserId={currentUserId}
                    replyToCommentId={replyToCommentId}
                    handleCancelReply={handleCancelReply}
                    handleCommentSubmit={handleCommentSubmit}
                    replyTo={replyTo}
                  />
                </>
              ))}
            </div>
            <CommentInput handleSubmit={handleCommentSubmit} />
          </div>
        )}
      </PageContainer>
    </>
  );
}
