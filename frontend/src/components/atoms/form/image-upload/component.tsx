'use client'

import { Paperclip, Xmark } from '@gravity-ui/icons'
import { Button } from '@gravity-ui/uikit'
import Image from 'next/image'
import { useRef } from 'react'

import styles from './component.module.css'

interface IImageUploadPreviewProps {
  preview: string | null
  onFileSelect: (file: File) => void
  onRemove: () => void
  accept?: string
  buttonText?: string
}

export const ImageUploadPreview = ({
  preview,
  onFileSelect,
  onRemove,
  accept = 'image/*',
  buttonText = 'Добавить фото',
}: IImageUploadPreviewProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    onFileSelect(file)
    e.target.value = ''
  }

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
        <div className={styles.previewWrapper}>
          <Image src={preview} alt="Фото" fill className={styles.previewImage} />
          <button type="button" className={styles.removeImage} onClick={onRemove}>
            <Xmark width={16} height={16} />
          </button>
        </div>
      ) : (
        <Button
          type="button"
          view="action"
          size="xl"
          className={styles.uploadButton}
          onClick={() => inputRef.current?.click()}
        >
          <Paperclip width={16} height={16} />
          {buttonText}
        </Button>
      )}
    </>
  )
}
