import { Typography } from '@components/typography/component'
import styles from './component.module.scss'

export type PasswordRequirementStatus = 'unmet' | 'met' | 'error'

export interface IPasswordRequirement {
  label: string
  status: PasswordRequirementStatus
}

interface IPasswordRequirementsProps {
  items: IPasswordRequirement[]
}

export const PasswordRequirements = ({ items }: IPasswordRequirementsProps) => (
  <div>
    <Typography variant="body1" className={styles.title}>
      Пароль должен содержать:
    </Typography>
    <ul className={styles.list} aria-live="polite">
      {items.map(({ label, status }) => (
        <li
          key={label}
          className={`${styles.item} ${status === 'error' ? styles.indicator_error : ''}`}
        >
          <span
            aria-hidden
            className={`${styles.indicator} ${status === 'met' ? styles.indicator_met : ''} ${status === 'error' ? styles.indicator_error : ''}`}
          />
          <Typography variant="body1">{label}</Typography>
        </li>
      ))}
    </ul>
  </div>
)
