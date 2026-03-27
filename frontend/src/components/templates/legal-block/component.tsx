import { Link, Text } from '@gravity-ui/uikit'

import styles from './component.module.css'

export const LegalBlock = () => (
  <Text variant="body-1" color="secondary" className={styles.container}>
    <span>Нажимая «Создать аккаунт», вы принимаете условия</span>
    <Link view="secondary" href="#">
      пользовательского соглашения
    </Link>
    <span>
      и{' '}
      <Link view="secondary" href="#">
        политики конфиденциальности
      </Link>
    </span>
  </Text>
)
