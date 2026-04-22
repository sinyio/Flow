"use client";

import { useState, useEffect, use, useRef } from "react";
import { useRouter } from "next/navigation";

import { Avatar, Button, Flex, Text, useToaster } from "@gravity-ui/uikit";
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
import { deletePost } from "@api/media/delete-post";
import { useApiContext } from "@contexts/api-context";
import { useCurrentUserStore } from "@utils/stores/current-user";

import { PageContainer } from "@components/global/page-container";
import { FormattedText } from "@components/atoms/formatted-text/component";

import styles from "./page.module.css";
import { getDate } from "@utils/get-date";
import { getNoun } from "@utils/get-noun";
import { PostHeader } from "@widgets/media";
import { CommentCard, CommentInput } from "@entities/comment";
import { Modal } from "src/ui-kit";

const FLOW_AUTHOR_ID = "adminuser";
const COMMENTS_PAGE_SIZE = 10;

interface CommentsSectionProps {
  commentsCount: number;
  comments: TMediaComment[];
  currentUserId?: string;
  replyToCommentId?: string;
  replyTo?: string;
  onCommentSubmit: (text: string) => void;
  onCommentLike: (id: string) => void;
  onReply: (commentId: string, authorName: string) => void;
  onDelete: (commentId: string) => void;
  onCancelReply: () => void;
}

function CommentsSection({
  commentsCount,
  comments,
  currentUserId,
  replyToCommentId,
  replyTo,
  onCommentSubmit,
  onCommentLike,
  onReply,
  onDelete,
  onCancelReply,
}: CommentsSectionProps) {
  const [visibleCount, setVisibleCount] = useState(COMMENTS_PAGE_SIZE);
  const visibleComments = comments.slice(0, visibleCount);
  const remaining = comments.length - visibleCount;

  return (
    <div className={styles.commentsSection}>
      <Flex direction="column" gap={4}>
        <Text variant="header-2" className={styles.commentsTitle}>
          {getNoun(commentsCount, "комментарий", "комментария", "комментариев")}
        </Text>
        <CommentInput handleSubmit={onCommentSubmit} />
      </Flex>
      <div className={styles.commentsList}>
        {visibleComments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            onLike={onCommentLike}
            onReply={onReply}
            onDelete={onDelete}
            currentUserId={currentUserId}
            replyToCommentId={replyToCommentId}
            handleCancelReply={onCancelReply}
            handleCommentSubmit={onCommentSubmit}
            replyTo={replyTo}
          />
        ))}
        {remaining > 0 && (
          <div
            className={styles.showMore}
            onClick={() => setVisibleCount((n) => n + COMMENTS_PAGE_SIZE)}
          >
            <Text variant="body-2" color="secondary">
              Показать ещё {getNoun(remaining, "комментарий", "комментария", "комментариев")}
            </Text>
          </div>
        )}
      </div>
    </div>
  );
}

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = use(params);
  const { apiClient } = useApiContext();
  const { fetch: fetchCurrentUser } = useCurrentUserStore();
  const router = useRouter();
  const { add } = useToaster();

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
    fetchCurrentUser(apiClient).then(userId => {
      if (userId) setCurrentUserId(userId);
    });
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
    const snapshot = { isLiked: post.isLiked, likesCount: post.likesCount };
    setPost((prev) =>
      prev
        ? { ...prev, isLiked: !prev.isLiked, likesCount: prev.isLiked ? prev.likesCount - 1 : prev.likesCount + 1 }
        : null,
    );
    togglePostLike(post.id, apiClient).catch(() => {
      setPost((prev) => prev ? { ...prev, ...snapshot } : null);
    });
  };

  const handleFavorite = () => {
    if (!post) return;
    const snapshot = { isFavorite: post.isFavorite, favoritesCount: post.favoritesCount };
    setPost((prev) =>
      prev
        ? { ...prev, isFavorite: !prev.isFavorite, favoritesCount: prev.isFavorite ? prev.favoritesCount - 1 : prev.favoritesCount + 1 }
        : null,
    );
    togglePostFavorite(post.id, apiClient).catch(() => {
      setPost((prev) => prev ? { ...prev, ...snapshot } : null);
    });
  };

  const handleCommentLike = (commentId: string) => {
    const applyToggle = (list: TMediaComment[]): TMediaComment[] =>
      list.map((c) =>
        c.id === commentId
          ? { ...c, isLiked: !c.isLiked, likesCount: c.isLiked ? c.likesCount - 1 : c.likesCount + 1 }
          : { ...c, replies: applyToggle(c.replies ?? []) },
      );
    const revert = (list: TMediaComment[]): TMediaComment[] =>
      list.map((c) =>
        c.id === commentId
          ? { ...c, isLiked: !c.isLiked, likesCount: c.isLiked ? c.likesCount - 1 : c.likesCount + 1 }
          : { ...c, replies: revert(c.replies ?? []) },
      );

    setComments((prev) => applyToggle(prev));
    toggleCommentLike(commentId, apiClient).catch(() => {
      setComments((prev) => revert(prev));
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

  const handleDeletePost = () => {
    deletePost(id, apiClient)
      .then(() => {
        add({ isClosable: true, theme: "success", name: "delete_post_success", title: "Пост удалён" });
        router.push("/media");
      })
      .catch(() => {
        add({ isClosable: true, theme: "danger", name: "delete_post_error", title: "Ошибка", content: "Не удалось удалить пост" });
      });
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
      {post.image && (
        <PostHeader
          photoUrl={post.image}
          postId={post.id}
          canEdit={!isFlowPost && post.author?.id === currentUserId}
          onDeletePost={handleDeletePost}
        />
      )}
      <PageContainer inner={{ className: styles.pageInner }}>
        <div className={styles.content}>
          <Text variant="display-3" className={styles.title} as="h1">
            {post.title}
          </Text>

          <div className={styles.meta}>
            {post.author && !isFlowPost && (
              <Flex gap={2} alignItems="center">
                <Avatar
                  size="s"
                  imgUrl={post.author.photo ?? undefined}
                  text={post.author.fullName}
                />
                <Text variant="body-2">{post.author.fullName}</Text>
              </Flex>
            )}
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

          {post.content && (
            <div className={styles.textContent}>
              <FormattedText text={post.content} variant="body-3" />
            </div>
          )}

          <Modal open={deleteModalOpen} onOpenChange={cancelDeleteComment}>
            <div className={styles.deleteModal}>
              <Text variant="header-2">Удалить комментарий?</Text>
              <Text variant="body-2" color="secondary">
                Это действие нельзя отменить.
              </Text>
              <div className={styles.deleteModalActions}>
                <Button onClick={cancelDeleteComment}>
                  <Text variant="body-2">Отмена</Text>
                </Button>
                <Button view="action" onClick={confirmDeleteComment}>
                  <Text variant="body-2">Удалить</Text>
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
          <CommentsSection
            commentsCount={post.commentsCount}
            comments={comments}
            currentUserId={currentUserId}
            replyToCommentId={replyToCommentId}
            replyTo={replyTo}
            onCommentSubmit={handleCommentSubmit}
            onCommentLike={handleCommentLike}
            onReply={handleReply}
            onDelete={handleDeleteComment}
            onCancelReply={handleCancelReply}
          />
        )}
      </PageContainer>
    </>
  );
}
