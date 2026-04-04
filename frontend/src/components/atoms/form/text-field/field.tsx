import { TextInput, TextInputProps } from '@gravity-ui/uikit'
import { FieldValues, useController, UseControllerProps } from 'react-hook-form'

interface ITextFieldProps<T extends FieldValues> extends TextInputProps {
  controllerProps: UseControllerProps<T>
}

export const TextField = <T extends FieldValues>({
  controllerProps,
  ...rest
}: ITextFieldProps<T>) => {
  const { field, fieldState } = useController(controllerProps)

  return (
    <TextInput
      size="xl"
      errorMessage={fieldState.error?.message}
      validationState={fieldState.invalid ? 'invalid' : undefined}
      {...field}
      {...rest}
    />
  )
}
