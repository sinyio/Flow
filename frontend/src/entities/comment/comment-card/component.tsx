"use client";

import styles from "./component.module.css";
import { TMediaComment } from "@api/media";
import { Avatar, Text, Button, Modal } from "@gravity-ui/uikit";
import { getDate } from "@utils/get-date";
import { useState } from "react";
import { ThumbsUp, ThumbsUpFill, TrashBin } from "@gravity-ui/icons";

interface CommentCardProps {
  comment: TMediaComment;
  onLike: (id: string) => void;
  onReply?: (commentId: string, authorName: string) => void;
  onDelete?: (commentId: string) => void;
  currentUserId?: string;
}

export const CommentCard = ({
  comment,
  onLike,
  onReply,
  onDelete,
  currentUserId,
}: CommentCardProps) => {
  const [showReplies, setShowReplies] = useState(false);
  const isOwnComment = currentUserId && comment.author?.id === currentUserId;

  return (
    <div className={styles.commentItem}>
      <div className={styles.commentMain}>
        <Avatar
          size="s"
          imgUrl={comment.author?.photo ?? undefined}
          text={comment.author?.fullName ?? ""}
        />
        <div className={styles.commentBody}>
          <div className={styles.commentHeader}>
            <Text variant="body-2">{comment.author?.fullName}</Text>
            <Text variant="body-2" color="secondary">
              {getDate(comment.createdAt, "regular")}
            </Text>
          </div>
          <Text variant="body-2" className={styles.commentText}>
            {comment.text}
          </Text>
          <div className={styles.commentActions}>
            <div
              className={styles.commentStat}
              onClick={() => onLike(comment.id)}
            >
              {comment.isLiked ? (
                <ThumbsUpFill width={12} height={12} />
              ) : (
                <ThumbsUp width={12} height={12} />
              )}
              <Text variant="caption-2">{comment.likesCount}</Text>
            </div>
            {!isOwnComment && onReply && (
              <div
                className={styles.replyButton}
                onClick={() =>
                  onReply(comment.id, comment.author?.fullName ?? "")
                }
              >
                <Text className={styles.commentStat} variant="caption-2">
                  Ответить
                </Text>
              </div>
            )}
            {isOwnComment && onDelete && (
              <div
                className={styles.deleteButton}
                onClick={() => onDelete(comment.id)}
              >
                <TrashBin width={12} height={12} />
              </div>
            )}
          </div>
        </div>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className={styles.replies}>
          <div
            className={styles.replyHeader}
            onClick={() => setShowReplies(!showReplies)}
          >
            {showReplies
              ? "Скрыть"
              : `Показать ответы (${comment.replies.length})`}
          </div>
          {showReplies &&
            comment?.replies?.map((reply) => {
              const isOwnReply = currentUserId && reply.author?.id === currentUserId;
              return (
                <div key={reply.id} className={styles.replyItem}>
                  <Avatar
                    size="xs"
                    imgUrl={reply.author?.photo ?? undefined}
                    text={reply.author?.fullName ?? ""}
                  />
                  <div className={styles.replyBody}>
                    <div className={styles.commentHeader}>
                      <Text variant="caption-1">{reply.author?.fullName}</Text>
                      {reply.parentId && (
                        <Text variant="caption-1" color="secondary">
                          → {comment.author?.fullName}
                        </Text>
                      )}
                      <Text variant="caption-1" color="secondary">
                        · {getDate(reply.createdAt, "regular")}
                      </Text>
                    </div>
                    <Text variant="body-2" className={styles.commentText}>
                      {reply.text}
                    </Text>
                    <div className={styles.commentActions}>
                      <div
                        className={styles.commentStat}
                        onClick={() => onLike(reply.id)}
                      >
                        {reply.isLiked ? (
                          <ThumbsUpFill width={12} height={12} />
                        ) : (
                          <ThumbsUp width={12} height={12} />
                        )}
                        <Text variant="caption-2">{reply.likesCount}</Text>
                      </div>
                      {onReply && (
                        <div
                          className={styles.replyButton}
                          onClick={() =>
                            onReply(reply.id, reply.author?.fullName ?? "")
                          }
                        >
                          <Text
                            className={styles.commentStat}
                            variant="caption-2"
                          >
                            Ответить
                          </Text>
                        </div>
                      )}
                      {isOwnReply && onDelete && (
                        <div
                          className={styles.deleteButton}
                          onClick={() => onDelete(reply.id)}
                        >
                          <TrashBin width={12} height={12} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};
