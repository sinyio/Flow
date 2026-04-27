'use client'

import { ArrowRight } from '@gravity-ui/icons'
import { Avatar, Button, Icon, Text } from '@gravity-ui/uikit'

import styles from './component.module.css'

export const ChatSupportBanner = () => {
  const handleClick = () => {
    // TODO: Добавить функционал поддержки когда будет готово
    console.log('Поддержка флоу clicked')
  }

  return (
    <div className={styles.container} onClick={handleClick}>
      <div className={styles.left}>
        <Avatar size="xl" theme="brand" text="ПФ" />
        <div className={styles.content}>
          <Text variant="subheader-2">Поддержка флоу</Text>
          <Text variant="body-2" color="complementary">
            Будем рады помочь
          </Text>
        </div>
      </div>

      <Button view="flat" size="s" className={styles.arrowButton}>
        <Icon data={ArrowRight} size={24} />
      </Button>
    </div>
  )
}
