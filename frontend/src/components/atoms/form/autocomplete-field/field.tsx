import { List, ListProps } from '@gravity-ui/uikit'
import { FieldValues, useController, UseControllerProps } from 'react-hook-form'

interface IAutocompleteProps<T extends FieldValues> extends ListProps {
  controllerProps: UseControllerProps<T>
}
export const AutocompleteField = <T extends FieldValues>({
  controllerProps,
  ...rest
}: IAutocompleteProps<T>) => {
  const { field } = useController(controllerProps)

  return (
    <List size="xl" itemsHeight={item => Math.min(item.length * 28, 5 * 28)} {...field} {...rest} />
  )
}
