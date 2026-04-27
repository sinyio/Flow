'use client'

import { useState } from 'react'
import { Button, DropdownMenu, Icon, Text, useToaster } from '@gravity-ui/uikit'
import { Pencil, TrashBin } from '@gravity-ui/icons'
import { useRouter } from 'next/navigation'

import { ArrowIcon } from '@components/svgr/arrow-icon/icon'
import { DotsIcon } from '@components/svgr/dots-icon/icon'
import { FlagIcon } from '@components/svgr/flag-icon/icon'
import { ShareIcon } from '@components/svgr/share-icon/icon'
import { Modal } from 'src/ui-kit'
import { ShareModal } from '@components/molecules/share-modal'

import styles from './header.module.css'

interface IHeaderProps {
  canEdit?: boolean
  adId?: string
  onDeleteAd?: () => void
  className?: string
}

export const Header = ({ canEdit, adId, onDeleteAd, className }: IHeaderProps) => {
  const router = useRouter()
  const { add } = useToaster()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState('')

  const notifySoon = () => {
    add({
      isClosable: true,
      theme: 'warning',
      name: 'feature_soon',
      title: 'Скоро',
      content: 'Эта функция пока недоступна.',
    })
  }

  const items = [
    ...(canEdit && adId
      ? [
          {
            iconStart: <Pencil />,
            text: 'Редактировать',
            action: () => router.push(`/ads/${adId}/edit`),
          },
        ]
      : []),
    {
      iconStart: <FlagIcon />,
      text: 'Пожаловаться',
      action: () => notifySoon(),
    },
    {
      iconStart: <ShareIcon />,
      text: 'Поделиться',
      action: () => { setShareUrl(window.location.href); setShareOpen(true) },
    },
    ...(canEdit
      ? [
          {
            iconStart: <TrashBin />,
            text: 'Удалить',
            theme: 'danger' as const,
            action: () => setDeleteModalOpen(true),
          },
        ]
      : []),
  ]

  return (
    <>
      <div className={`${styles.header} ${className ?? ''}`}>
        <Button view="normal" size="l" type="button" onClick={() => router.back()} className={styles.menuButton}>
          <Icon data={ArrowIcon} />
        </Button>
        <DropdownMenu
          size="l"
          popupProps={{ placement: 'bottom-end', offset: 8, style: { width: '200px' } }}
          renderSwitcher={props => (
            <Button {...props} view="normal" size="l" className={styles.menuButton}>
              <Icon data={DotsIcon} />
            </Button>
          )}
          items={items}
        />
      </div>
      <Modal open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <div className={styles.deleteModal}>
          <Text variant="header-2">Удалить объявление?</Text>
          <Text variant="body-2" color="secondary">
            Это действие нельзя отменить.
          </Text>
          <div className={styles.deleteModalActions}>
            <Button onClick={() => setDeleteModalOpen(false)}>
              <Text variant="body-2">Отмена</Text>
            </Button>
            <Button
              view="action"
              onClick={() => {
                setDeleteModalOpen(false)
                onDeleteAd?.()
              }}
            >
              <Text variant="body-2">Удалить</Text>
            </Button>
          </div>
        </div>
      </Modal>
      <ShareModal open={shareOpen} onOpenChange={setShareOpen} url={shareUrl} title={adId ? 'Поделиться объявлением' : 'Поделиться профилем'} />
    </>
  )
}
