"use client";

import { useRef, useState } from "react";
import { Icon, Text } from "@gravity-ui/uikit";
import { PaperPlane } from "@gravity-ui/icons";
import styles from "./component.module.css";

const COMMENT_MAX = 1_000;
const COMMENT_COUNTER_THRESHOLD = 800;

export interface ICommentInputProps {
  replyTo?: string;
  handleSubmit?: (text: string) => void;
  onCancel?: () => void;
  disabled?: boolean;
}

export const CommentInput = ({
  replyTo,
  handleSubmit,
  onCancel,
  disabled = false,
}: ICommentInputProps) => {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    resize(e.target);
  };

  const submit = () => {
    if (!text.trim() || text.length > COMMENT_MAX) return;
    const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n{3,}/g, '\n\n');
    handleSubmit?.(normalized);
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const isOverLimit = text.length > COMMENT_MAX;
  const showCounter = text.length >= COMMENT_COUNTER_THRESHOLD;

  return (
    <div className={styles.container}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div className={styles.inputWrapper}>
          {replyTo && onCancel && (
            <span className={styles.cancelLabel} onClick={onCancel}>
              Отмена
            </span>
          )}
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            placeholder={replyTo ? `Ответить ${replyTo}` : "Написать комментарий"}
            disabled={disabled}
            value={text}
            rows={1}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <div className={styles.sendWrapper}>
            {showCounter && (
              <Text
                variant="caption-1"
                color={isOverLimit ? "danger" : "secondary"}
                className={styles.counter}
              >
                {text.length}/{COMMENT_MAX}
              </Text>
            )}
            <button
              type="submit"
              disabled={!text.trim() || disabled || isOverLimit}
              className={styles.sendButton}
            >
              <Icon data={PaperPlane} size={20} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
