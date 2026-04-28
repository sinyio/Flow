'use client'

import { CircleCheck } from '@gravity-ui/icons'
import { Button, Icon, Text } from '@gravity-ui/uikit'

import styles from './component.module.css'

export interface IDealConfirmBarProps {
  onConfirm: () => void
  isLoading?: boolean
}

export const DealConfirmBar = ({ onConfirm, isLoading }: IDealConfirmBarProps) => (
  <div className={styles.container}>
    <Icon data={CircleCheck} size={32} className={styles.icon} />

    <Text variant="body-2" color="complementary" className={styles.text}>
      Если договорились – выберите исполнителя, чтобы он мог приступить к задаче
    </Text>

    <Button view="outlined" size="m" onClick={onConfirm} loading={isLoading} width="max">
      Выбрать исполнителем
    </Button>
  </div>
)
