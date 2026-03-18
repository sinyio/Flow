import { Typography, typographyMap } from '@components/typography/component'
import { TextLink } from '@components/text-link/component'
import styles from './component.module.scss'

export const LegalBlock = () => (
  <Typography variant="body1" className={styles.container}>
    <span>Нажимая «Создать аккаунт», вы принимаете условия</span>
    <TextLink className={typographyMap.body1} style={{ color: 'var(--text-secondary)' }} href="#">
      пользовательского соглашения
    </TextLink>
    <span>
      и{' '}
      <TextLink className={typographyMap.body1} style={{ color: 'var(--text-secondary)' }} href="#">
        политики конфиденциальности
      </TextLink>
    </span>
  </Typography>
)
