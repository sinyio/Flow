'use client'

import { Text } from '@gravity-ui/uikit'
import { useMemo } from 'react'
import { Control, FieldValues, useWatch } from 'react-hook-form'

import { buildPasswordRequirementItems } from '@views/authorization/steps/sign-up-step/validation-schema'

import styles from './component.module.css'

export type PasswordRequirementStatus = 'unmet' | 'met' | 'error'

export interface IPasswordRequirement {
  label: string
  status: PasswordRequirementStatus
}

interface IPasswordRequirementsProps<T extends FieldValues> {
  control: Control<T>
}

export const PasswordRequirements = <T extends FieldValues>({
  control,
}: IPasswordRequirementsProps<T>) => {
  const password = useWatch({ control, name: 'password' as T['password'] }) ?? ''

  const items = useMemo(() => buildPasswordRequirementItems(password), [password])

  return (
    <div>
      <Text variant="body-1" className={styles.title}>
        Пароль должен содержать:
      </Text>
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
            <Text variant="body-1">{label}</Text>
          </li>
        ))}
      </ul>
    </div>
  )
}
