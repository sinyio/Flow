/* eslint-disable no-irregular-whitespace */
import { Button, Icon, Text } from '@gravity-ui/uikit'

import { BellIcon } from '@components/svgr/bell-icon/icon'

import styles from './component.module.css'

export const NotFoundAd = () => (
  <div className={styles.container}>
    <div className={styles.textContainer}>
      <Text variant="display-1">Не нашли подходящее объявление?</Text>
      <Text variant="body-3" color="secondary">
        Подпишитесь на email уведомления по выбранному направлению
      </Text>
    </div>
    <Button view="action" size="xl" width="max">
      <Icon data={BellIcon} />
      Подписаться
    </Button>
  </div>
)
