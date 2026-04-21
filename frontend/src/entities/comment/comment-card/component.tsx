"use client";

import styles from "./component.module.css";
import { TMediaComment } from "@api/media";
import { Avatar, Text } from "@gravity-ui/uikit";
import { getDate } from "@utils/get-date";
import { useState, useEffect, useRef } from "react";
import { ThumbsUp, ThumbsUpFill } from "@gravity-ui/icons";
import { CommentInput } from "../comment-input";

const REPLIES_PAGE_SIZE = 3;

interface CommentItemProps {
  id: string;
  author?: { id: string; fullName: string; photo?: string | null } | null;
  replyTo?: { fullName: string } | null;
  parentId?: string | null;
  text: string;
  createdAt: string;
  isLiked: boolean;
  likesCount: number;
  avatarSize: "l" | "m" | "s" | "xs";
  currentUserId?: string;
  replyToCommentId?: string | null;
  replyToName?: string;
  onLike: (id: string) => void;
  onReply?: (commentId: string, authorName: string) => void;
  onDelete?: (commentId: string) => void;
  onCancelReply?: () => void;
  onSubmitReply?: (text: string) => void;
}

const CommentItem = ({
  id,
  author,
  replyTo,
  parentId,
  text,
  createdAt,
  isLiked,
  likesCount,
  avatarSize,
  currentUserId,
  replyToCommentId,
  replyToName,
  onLike,
  onReply,
  onDelete,
  onCancelReply,
  onSubmitReply,
}: CommentItemProps) => {
  const isOwn = currentUserId && author?.id === currentUserId;
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (el) setOverflows(el.scrollHeight > el.clientHeight);
  }, [text]);

  return (
    <>
      <div className={styles.commentTop}>
        <Avatar
          size={avatarSize}
          imgUrl={author?.photo ?? undefined}
          text={author?.fullName ?? ""}
        />
        <div className={styles.commentHeader}>
          <div className={styles.replyMeta}>
            <Text variant="body-2">{author?.fullName}</Text>
            {parentId && replyTo && (
              <Text variant="body-2" color="secondary">
                → {replyTo.fullName}
              </Text>
            )}
          </div>
          <Text variant="body-1" color="secondary">
            {getDate(createdAt, "short")}
          </Text>
        </div>
      </div>
      <div className={styles.textWrapper}>
        <div
          ref={textRef}
          className={expanded ? styles.commentText : styles.commentTextClamped}
        >
          <Text variant="body-3">
            {text}
            {expanded && (
              <span
                className={styles.collapseLabel}
                onClick={() => setExpanded(false)}
              >
                скрыть
              </span>
            )}
          </Text>
        </div>
        {!expanded && overflows && (
          <span
            className={styles.expandLabel}
            onClick={() => setExpanded(true)}
          >
            ещё
          </span>
        )}
      </div>
      <div className={styles.commentActions}>
        <div className={styles.commentActionsLeft}>
          {!isOwn && onReply && (
            <div
              className={styles.replyButton}
              onClick={() => onReply(id, author?.fullName ?? "")}
            >
              <Text className={styles.commentStat} variant="body-1">
                Ответить
              </Text>
            </div>
          )}
          {isOwn && onDelete && (
            <div className={styles.deleteButton} onClick={() => onDelete(id)}>
              <Text className={styles.commentStat} variant="body-1">
                Удалить
              </Text>
            </div>
          )}
        </div>
        <div className={styles.commentStat} onClick={() => onLike(id)}>
          {isLiked ? (
            <ThumbsUpFill width={16} height={16} />
          ) : (
            <ThumbsUp width={16} height={16} />
          )}
          <Text variant="body-2">{likesCount}</Text>
        </div>
      </div>
      {replyToCommentId === id && (
        <div className={styles.replyInput}>
          <CommentInput
            replyTo={replyToName}
            handleSubmit={onSubmitReply}
            onCancel={onCancelReply}
          />
        </div>
      )}
    </>
  );
};

interface CommentCardProps {
  comment: TMediaComment;
  onLike: (id: string) => void;
  onReply?: (commentId: string, authorName: string) => void;
  onDelete?: (commentId: string) => void;
  currentUserId?: string;
  replyToCommentId?: string | null;
  handleCancelReply?: () => void;
  handleCommentSubmit?: (text: string) => void;
  replyTo?: string;
}

export const CommentCard = ({
  comment,
  onLike,
  onReply,
  onDelete,
  currentUserId,
  replyToCommentId,
  handleCancelReply,
  handleCommentSubmit,
  replyTo,
}: CommentCardProps) => {
  const [showReplies, setShowReplies] = useState(false);
  const [visibleReplies, setVisibleReplies] = useState(REPLIES_PAGE_SIZE);

  const replyIds = comment.replies?.map((r) => r.id) ?? [];
  const isReplyingHere =
    replyToCommentId === comment.id ||
    replyIds.includes(replyToCommentId ?? "");

  useEffect(() => {
    if (isReplyingHere) {
      setShowReplies(true);
      if (replyToCommentId && replyToCommentId !== comment.id) {
        const idx = replyIds.indexOf(replyToCommentId);
        if (idx >= visibleReplies) {
          setVisibleReplies(idx + 1);
        }
      }
    }
  }, [isReplyingHere, replyToCommentId]);

  const shownReplies = comment.replies?.slice(0, visibleReplies) ?? [];
  const remainingReplies = (comment.replies?.length ?? 0) - visibleReplies;

  return (
    <div className={styles.commentItem}>
      <CommentItem
        id={comment.id}
        author={comment.author}
        text={comment.text}
        createdAt={comment.createdAt}
        isLiked={comment.isLiked}
        likesCount={comment.likesCount}
        avatarSize="m"
        currentUserId={currentUserId}
        replyToCommentId={replyToCommentId}
        replyToName={replyTo}
        onLike={onLike}
        onReply={onReply}
        onDelete={onDelete}
        onCancelReply={handleCancelReply}
        onSubmitReply={handleCommentSubmit}
      />
      {comment.replies && comment.replies.length > 0 && (
        <div className={styles.replies}>
          <div
            className={styles.replyHeader}
            onClick={() => setShowReplies(!showReplies)}
          >
            <Text variant="caption-2">
              {showReplies
                ? `↑ Скрыть`
                : `↓ Ответы · ${comment.replies.length}`}
            </Text>
          </div>
          {showReplies && (
            <>
              {shownReplies.map((reply) => (
                <div key={reply.id} className={styles.replyContainer}>
                  <CommentItem
                    id={reply.id}
                    author={reply.author}
                    replyTo={reply.replyTo}
                    parentId={reply.parentId}
                    text={reply.text}
                    createdAt={reply.createdAt}
                    isLiked={reply.isLiked}
                    likesCount={reply.likesCount}
                    avatarSize="m"
                    currentUserId={currentUserId}
                    replyToCommentId={replyToCommentId}
                    replyToName={replyTo}
                    onLike={onLike}
                    onReply={onReply}
                    onDelete={onDelete}
                    onCancelReply={handleCancelReply}
                    onSubmitReply={handleCommentSubmit}
                  />
                </div>
              ))}
              {remainingReplies > 0 && (
                <div
                  className={styles.showMoreReplies}
                  onClick={() =>
                    setVisibleReplies((n) => n + REPLIES_PAGE_SIZE)
                  }
                >
                  <Text variant="caption-2" color="secondary">
                    Показать ещё {remainingReplies} ответов
                  </Text>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
