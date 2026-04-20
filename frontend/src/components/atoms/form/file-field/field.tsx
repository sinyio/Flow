'use client'

import { Xmark } from '@gravity-ui/icons'
import { Button, Icon, Text } from '@gravity-ui/uikit'
import { useRef } from 'react'
import { FieldValues, useController, UseControllerProps } from 'react-hook-form'

import styles from './field.module.css'

interface IFileFieldProps<T extends FieldValues> {
  controllerProps: UseControllerProps<T>
  accept?: string
  multiple?: boolean
  buttonText?: string
  maxFiles?: number
}

export const FileField = <T extends FieldValues>({
  controllerProps,
  accept = '*/*',
  multiple = false,
  buttonText = 'Выбрать файлы',
  maxFiles,
}: IFileFieldProps<T>) => {
  const { field, fieldState } = useController(controllerProps)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const files: File[] = field.value || []

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])

    let newFiles = multiple ? [...files, ...selectedFiles] : selectedFiles

    if (maxFiles && newFiles.length > maxFiles) {
      newFiles = newFiles.slice(0, maxFiles)
    }

    field.onChange(newFiles)

    // Сбросить input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)

    field.onChange(newFiles)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={styles.container}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className={styles.hiddenInput}
      />

      <Button type="button" view="outlined" size="xl" onClick={handleClick}>
        {buttonText}
      </Button>

      {files.length > 0 && (
        <div className={styles.filesList}>
          {files.map((file, index) => (
            <div key={`${file.name}-${index}`} className={styles.fileChip}>
              <Text variant="body-2">{file.name}</Text>
              <Button
                view="flat"
                size="s"
                onClick={() => handleRemoveFile(index)}
                className={styles.removeButton}
              >
                <Icon data={Xmark} size={16} />
              </Button>
            </div>
          ))}
        </div>
      )}

      {fieldState.error && (
        <Text variant="body-2" color="danger">
          {fieldState.error.message}
        </Text>
      )}
    </div>
  )
}
