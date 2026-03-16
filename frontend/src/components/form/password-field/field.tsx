import { Button, Icon, TextInput, TextInputProps } from '@gravity-ui/uikit'
import { FieldValues, useController, UseControllerProps } from 'react-hook-form'
import { useState } from 'react'

import { EyeSlashIcon } from '@components/svgr/eye-slash-icon/icon'
import { EyeIcon } from '@components/svgr/eye-icon/icon'
import styles from './field.module.css'

interface IPasswordFieldProps<T extends FieldValues> extends TextInputProps {
  controllerProps: UseControllerProps<T>
}

export const PasswordField = <T extends FieldValues>({
  controllerProps,
  ...rest
}: IPasswordFieldProps<T>) => {
  const { field, fieldState } = useController(controllerProps)

  const [isPasswordShown, setIsPasswordShown] = useState(false)

  return (
    <TextInput
      type={isPasswordShown ? 'text' : 'password'}
      size="xl"
      errorMessage={fieldState.error?.message}
      validationState={fieldState.invalid ? 'invalid' : undefined}
      endContent={
        <Button
          type="button"
          view="flat"
          onClick={() => setIsPasswordShown(prev => !prev)}
          aria-label={isPasswordShown ? 'Скрыть пароль' : 'Показать пароль'}
          className={styles.endButton}
        >
          <Icon data={isPasswordShown ? EyeSlashIcon : EyeIcon} height={16} width={16} />
        </Button>
      }
      {...field}
      {...rest}
    />
  )
}
