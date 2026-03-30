import { TextArea, TextAreaProps } from '@gravity-ui/uikit'
import { FieldValues, useController, UseControllerProps } from 'react-hook-form'

interface ITextAreaFieldProps<T extends FieldValues> extends TextAreaProps {
  controllerProps: UseControllerProps<T>
}

export const TextAreaField = <T extends FieldValues>({
  controllerProps,
  ...rest
}: ITextAreaFieldProps<T>) => {
  const { field, fieldState } = useController(controllerProps)

  return (
    <TextArea
      size="xl"
      errorMessage={fieldState.error?.message}
      validationState={fieldState.invalid ? 'invalid' : undefined}
      {...field}
      {...rest}
    />
  )
}

