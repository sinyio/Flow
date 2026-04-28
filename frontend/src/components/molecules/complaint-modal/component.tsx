'use client'

import { useState } from 'react'
import { Button, Text, TextArea, useToaster } from '@gravity-ui/uikit'

import { createComplaint, TComplaintType } from '@api/admin'
import { useAxiosInstance } from '@api/use-axios-instance'
import { normalizeContent } from '@utils/normalize-content'
import { Modal } from 'src/ui-kit'

import styles from './component.module.css'

interface IComplaintModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: TComplaintType
  targetId: string
}

export const ComplaintModal = ({ open, onOpenChange, type, targetId }: IComplaintModalProps) => {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const { add } = useToaster()
  const axiosInstance = useAxiosInstance()

  const handleClose = () => {
    setText('')
    onOpenChange(false)
  }

  const handleSubmit = async () => {
    const normalized = normalizeContent(text.trim())
    if (!normalized) return

    setLoading(true)
    try {
      await createComplaint(
        {
          type,
          text: normalized,
          ...(type === 'AD' ? { targetAdId: targetId } : {}),
          ...(type === 'POST' ? { targetPostId: targetId } : {}),
          ...(type === 'USER' ? { targetUserId: targetId } : {}),
        },
        axiosInstance,
      )
      add({ name: 'complaint_ok', theme: 'success', title: 'Жалоба отправлена', isClosable: true })
      handleClose()
    } catch {
      add({ name: 'complaint_err', theme: 'danger', title: 'Не удалось отправить жалобу', isClosable: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onOpenChange={handleClose}>
      <div className={styles.container}>
        <Text variant="header-2">Пожаловаться</Text>
        <Text variant="body-2" color="secondary">
          Опишите причину жалобы — мы рассмотрим её в ближайшее время.
        </Text>
        <TextArea
          value={text}
          onUpdate={setText}
          placeholder="Причина жалобы..."
          rows={4}
          disabled={loading}
        />
        <div className={styles.actions}>
          <Button view="normal" size="l" onClick={handleClose} disabled={loading}>
            Отмена
          </Button>
          <Button
            view="action"
            size="l"
            onClick={handleSubmit}
            loading={loading}
            disabled={!normalizeContent(text.trim())}
          >
            Отправить
          </Button>
        </div>
      </div>
    </Modal>
  )
}
