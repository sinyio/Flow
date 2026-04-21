"use client";

import { useState } from "react";
import { TextInput } from "@gravity-ui/uikit";
import styles from "./component.module.css";

export interface ICommentInputProps {
  replyTo?: string;
  handleSubmit?: (text: string) => void;
  disabled?: boolean;
}

export const CommentInput = ({
  replyTo,
  handleSubmit,
  disabled = false,
}: ICommentInputProps) => {
  const [text, setText] = useState("");

  return (
    <div className={styles.container}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (text.trim()) {
            handleSubmit?.(text);
            setText("");
          }
        }}
      >
        <TextInput
          className={styles.input}
          size="xl"
          placeholder={replyTo ? `Ответить ${replyTo}` : "Написать комментарий"}
          disabled={disabled}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </form>
    </div>
  );
};
