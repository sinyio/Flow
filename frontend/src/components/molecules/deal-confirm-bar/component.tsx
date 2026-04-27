'use client'

import { Button, Text } from '@gravity-ui/uikit'

import styles from './component.module.css'

export interface IDealConfirmBarProps {
  onConfirm: () => void
  isLoading?: boolean
}

export const DealConfirmBar = ({ onConfirm, isLoading }: IDealConfirmBarProps) => {
  return (
    <div className={styles.container}>
      <Text variant="body-1" color="secondary">
        Если вы договорились — выберите исполнителем
      </Text>

      <Button
        view="action"
        size="l"
        onClick={onConfirm}
        loading={isLoading}
        width="max"
      >
        Выбрать исполнителем
      </Button>
    </div>
  )
}
