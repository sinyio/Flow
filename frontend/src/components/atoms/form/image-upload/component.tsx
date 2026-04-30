"use client";

import { Paperclip, Xmark } from "@gravity-ui/icons";
import { Button, Text } from "@gravity-ui/uikit";
import Image from "next/image";
import { useRef } from "react";

import styles from "./component.module.css";

interface IImageUploadPreviewProps {
  preview: string | null;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
  accept?: string;
  buttonText?: string;
  aspectRatio?: string;
  maxWidth?: number | string;
  hint?: string;
  hintError?: boolean;
  hintErrorText?: string;
}

export const ImageUploadPreview = ({
  preview,
  onFileSelect,
  onRemove,
  accept = "image/*",
  buttonText = "Добавить фото",
  aspectRatio,
  maxWidth,
  hint,
  hintError,
  hintErrorText = 'Файл превышает 10 МБ',
}: IImageUploadPreviewProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onFileSelect(file);
    e.target.value = "";
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className={styles.hiddenInput}
        onChange={handleChange}
      />
      {preview ? (
        <div
          className={styles.previewWrapper}
          style={{
            ...(aspectRatio && { aspectRatio }),
            ...(maxWidth && { maxWidth }),
          }}
        >
          <Image
            src={preview}
            alt="Фото"
            fill
            className={styles.previewImage}
          />
          <button
            type="button"
            className={styles.removeImage}
            onClick={onRemove}
          >
            <Xmark width={20} height={20} />
          </button>
        </div>
      ) : (
        <div>
          <Button
            type="button"
            view="action"
            size="xl"
            className={styles.uploadButton}
            onClick={() => inputRef.current?.click()}
          >
            <div className={styles.uploadButtonInner}>
              <Paperclip width={18} height={18} />
              {buttonText}
            </div>
          </Button>
          {hint && <p className={styles.hint}>{hint}</p>}
        </div>
      )}
      {hintError && <p className={styles.hintError}>{hintErrorText}</p>}
    </>
  );
};
