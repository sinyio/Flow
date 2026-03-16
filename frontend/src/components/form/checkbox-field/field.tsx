import { Checkbox, CheckboxProps } from '@gravity-ui/uikit'
import { FieldValues, useController, UseControllerProps } from 'react-hook-form'

import { Typography } from '@components/typography/component'

interface ICheckboxProps<T extends FieldValues> extends CheckboxProps {
  controllerProps: UseControllerProps<T>
}

export const CheckboxField = <T extends FieldValues>({
  controllerProps,
  ...rest
}: ICheckboxProps<T>) => {
  const { field } = useController(controllerProps)

  return (
    <Checkbox size="xl" checked={field.value} {...field} {...rest}>
      <Typography variant="body2">Запомнить меня</Typography>
    </Checkbox>
  )
}
