'use client'

import { useState } from 'react'
import { Button, Icon, Text } from '@gravity-ui/uikit'
import { Check, Copy } from '@gravity-ui/icons'

import { Modal } from 'src/ui-kit'

import styles from './component.module.css'

interface IShareModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  url: string
  title?: string
}

export const ShareModal = ({ open, onOpenChange, url, title = 'Поделиться' }: IShareModalProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <div className={styles.container}>
        <Text variant="header-2">{title}</Text>
        <div className={styles.urlRow}>
          <Text variant="body-2" color="secondary" className={styles.url}>
            {url}
          </Text>
          <Button view={copied ? 'normal' : 'action'} size="m" onClick={handleCopy} className={styles.copyBtn}>
            <Icon data={copied ? Check : Copy} size={16} />
            {copied ? 'Скопировано' : 'Копировать'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
