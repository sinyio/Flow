import { Button, Text } from '@gravity-ui/uikit'

import styles from './component.module.css'

export interface IErrorTemplateProps {
  title: string
  message: string
  buttonText: string
  onClick?: () => void
}

export const ErrorTemplate = ({ title, message, buttonText, onClick }: IErrorTemplateProps) => (
  <div className={styles.container}>
    <div className={styles.textContainer}>
      <Text variant="header-2" color="complementary">
        {title}
      </Text>
      <Text variant="body-2" color="secondary">
        {message}
      </Text>
    </div>
    <Button size="xl" view="action" width="max" onClick={onClick}>
      <Text variant="body-3">{buttonText}</Text>
    </Button>
  </div>
)
