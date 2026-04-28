'use client'

import { PaperPlane, Xmark } from '@gravity-ui/icons'
import { Button, Icon, Text, TextInput } from '@gravity-ui/uikit'
import { useEffect, useMemo, useRef, useState } from 'react'

import { PlusCircleIcon } from '@components/svgr/plus-circle-icon/icon'

import styles from './component.module.css'

export interface IChatInputBarProps {
  onSend: (text: string, files?: File[]) => void
  disabled?: boolean
}

export const ChatInputBar = ({ onSend, disabled = false }: IChatInputBarProps) => {
  const [text, setText] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const previews = useMemo(
    () =>
      selectedFiles.map(file => ({
        file,
        isImage: file.type.startsWith('image/'),
        url: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      })),
    [selectedFiles]
  )

  useEffect(
    () => () => {
      previews.forEach(p => {
        if (p.url) URL.revokeObjectURL(p.url)
      })
    },
    [previews]
  )

  const handleSend = () => {
    if ((!text.trim() && selectedFiles.length === 0) || disabled) return

    onSend(text.trim(), selectedFiles.length > 0 ? selectedFiles : undefined)
    setText('')
    setSelectedFiles([])
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    setSelectedFiles(prev => [...prev, ...files])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleAttachClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={styles.container}>
      {previews.length > 0 && (
        <div className={styles.filesPreview}>
          {previews.map((preview, index) => (
            <div key={`${preview.file.name}-${index}`} className={styles.previewItem}>
              {preview.isImage && preview.url ? (
                <div className={styles.imageThumbnail}>
                  <img src={preview.url} alt={preview.file.name} className={styles.thumbnailImg} />
                  <Button
                    view="flat"
                    size="xs"
                    className={styles.removeOverlay}
                    onClick={() => handleRemoveFile(index)}
                  >
                    <Icon data={Xmark} size={14} />
                  </Button>
                </div>
              ) : (
                <div className={styles.fileChip}>
                  <Text variant="caption-1">{preview.file.name}</Text>
                  <Button view="flat" size="xs" onClick={() => handleRemoveFile(index)}>
                    <Icon data={Xmark} size={14} />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className={styles.inputRow}>
        <input
          multiple
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,.doc,.docx,.txt"
          onChange={handleFileSelect}
          className={styles.hiddenInput}
        />

        <button type="button" onClick={handleAttachClick} className={styles.attachButton}>
          <PlusCircleIcon />
        </button>

        <TextInput
          size="xl"
          view="normal"
          placeholder="Введите сообщение"
          value={text}
          onUpdate={setText}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={styles.input}
        />

        <Button
          view="action"
          size="xl"
          onClick={handleSend}
          disabled={disabled || (!text.trim() && selectedFiles.length === 0)}
          className={styles.sendButton}
        >
          <Icon data={PaperPlane} size={20} />
        </Button>
      </div>
    </div>
  )
}
