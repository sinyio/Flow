'use client'

import { Icon, TextInput, TextInputProps } from '@gravity-ui/uikit'
import { FieldValues, useController, UseControllerProps } from 'react-hook-form'

import { EnvelopeIcon } from '@components/svgr/envelope-icon/icon'

interface IEmailFieldProps<T extends FieldValues> extends TextInputProps {
  controllerProps: UseControllerProps<T>
}

export const EmailField = <T extends FieldValues>({
  controllerProps,
  ...rest
}: IEmailFieldProps<T>) => {
  const { field, fieldState } = useController(controllerProps)

  return (
    <TextInput
      type="email"
      placeholder="Email"
      size="xl"
      errorMessage={fieldState.error?.message}
      validationState={fieldState.invalid ? 'invalid' : undefined}
      endContent={<Icon data={EnvelopeIcon} style={{ paddingRight: '6px' }} />}
      {...field}
      {...rest}
    />
  )
}
