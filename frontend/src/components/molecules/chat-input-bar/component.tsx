'use client'

import { Plus, Xmark } from '@gravity-ui/icons'
import { Button, Icon, Text, TextInput } from '@gravity-ui/uikit'
import { useRef, useState } from 'react'

import styles from './component.module.css'

export interface IChatInputBarProps {
  onSend: (text: string, files?: File[]) => void
  disabled?: boolean
}

export const ChatInputBar = ({ onSend, disabled = false }: IChatInputBarProps) => {
  const [text, setText] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    if ((!text.trim() && selectedFiles.length === 0) || disabled) return

    onSend(text.trim(), selectedFiles.length > 0 ? selectedFiles : undefined)
    setText('')
    setSelectedFiles([])
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    setSelectedFiles(prev => [...prev, ...files])
    // Сбросить input чтобы можно было выбрать тот же файл снова
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
      {selectedFiles.length > 0 && (
        <div className={styles.filesPreview}>
          {selectedFiles.map((file, index) => (
            <div key={`${file.name}-${index}`} className={styles.fileChip}>
              <Text variant="caption-1">{file.name}</Text>
              <Button view="flat" size="xs" onClick={() => handleRemoveFile(index)}>
                <Icon data={Xmark} size={14} />
              </Button>
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
          style={{ display: 'none' }}
        />

        <Button
          view="outlined"
          size="l"
          onClick={handleAttachClick}
          className={styles.attachButton}
        >
          <Icon data={Plus} size={20} />
        </Button>

        <TextInput
          size="xl"
          placeholder="Введите сообщение"
          value={text}
          onUpdate={setText}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={styles.input}
        />
      </div>
    </div>
  )
}
