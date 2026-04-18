'use client'

import { ArrowRight, Headphones } from '@gravity-ui/icons'
import { Icon, Text } from '@gravity-ui/uikit'

import { Card } from '@components/templates/card'

import styles from './component.module.css'

export const ChatSupportBanner = () => {
  const handleClick = () => {
    // TODO: Добавить функционал поддержки когда будет готово
    console.log('Поддержка флоу clicked')
  }

  return (
    <Card className={styles.container} onClick={handleClick}>
      <div className={styles.iconWrapper}>
        <Icon data={Headphones} size={24} />
      </div>

      <div className={styles.content}>
        <Text variant="subheader-2">Поддержка флоу</Text>
        <Text variant="body-2" color="secondary">
          Будем рады помочь
        </Text>
      </div>

      <Icon data={ArrowRight} size={20} className={styles.arrow} />
    </Card>
  )
}
