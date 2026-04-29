'use client'

import { CircleQuestion } from '@gravity-ui/icons'
import { Button, Icon, Text } from '@gravity-ui/uikit'
import { useState } from 'react'

import { confirmCourier } from '@api/ads'
import { useAxiosInstance } from '@api/use-axios-instance'

import styles from './component.module.css'

export interface ICourierSelectedMessageProps {
  adId: string
  isConfirmed?: boolean
}

export const CourierSelectedMessage = ({ adId, isConfirmed = false }: ICourierSelectedMessageProps) => {
  const axios = useAxiosInstance()
  const [isLoading, setIsLoading] = useState(false)
  const [isDone, setIsDone] = useState(isConfirmed)

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      await confirmCourier({ adId }, axios)
      setIsDone(true)
    } catch (err) {
      console.error('[CourierSelectedMessage] confirmCourier failed:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.block}>
        <Text variant="body-2" color="complementary" className={styles.text}>
          Заказчик выбрал вас в качестве исполнителя для задачи
        </Text>
      </div>

      <div className={styles.block}>
        <Icon data={CircleQuestion} size={32} className={styles.icon} />
        <Text variant="body-2" color="complementary" className={styles.text}>
          Если вы договорились с заказчиком, подтвердите выбор задания
        </Text>
        <Button
          view="outlined"
          size="m"
          onClick={handleConfirm}
          loading={isLoading}
          disabled={isDone}
          width="max"
        >
          {isDone ? 'Задание выбрано' : 'Выбрать это задание'}
        </Button>
      </div>
    </div>
  )
}
