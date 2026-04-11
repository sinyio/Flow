import { TextInput, TextInputProps } from '@gravity-ui/uikit'
import { useMaskito } from '@maskito/react'
import { FieldValues, useController, UseControllerProps } from 'react-hook-form'

import { moneyMask } from './config'

interface ITextFieldProps<T extends FieldValues> extends TextInputProps {
  controllerProps: UseControllerProps<T>
}

export const MoneyField = <T extends FieldValues>({
  controllerProps,
  ...rest
}: ITextFieldProps<T>) => {
  const { field, fieldState } = useController(controllerProps)

  const inputRef = useMaskito({ options: moneyMask })

  return (
    <TextInput
      size="xl"
      errorMessage={fieldState.error?.message}
      validationState={fieldState.invalid ? 'invalid' : undefined}
      {...field}
      {...rest}
      ref={node => {
        inputRef(node)
        field.ref(node)
      }}
    />
  )
}
