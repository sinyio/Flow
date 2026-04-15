'use client'

import { Select, SelectProps } from '@gravity-ui/uikit'
import { useMemo } from 'react'
import { FieldValues, useController, UseControllerProps } from 'react-hook-form'

interface ISelectProps<T extends FieldValues> extends SelectProps {
  controllerProps: UseControllerProps<T>
}

/** У Gravity UI Select значение — `string[]`, для одиночного выбора это `['male']` или `[]` */
const fieldValueToSelectValue = (value: unknown, multiple?: boolean): string[] => {
  if (multiple) {
    if (Array.isArray(value)) {
      return value.map(String)
    }

    return []
  }

  if (value === null || value === undefined || value === '') {
    return []
  }

  return [String(value)]
}

export const SelectField = <T extends FieldValues>({
  controllerProps,
  ...rest
}: ISelectProps<T>) => {
  const { field, fieldState } = useController(controllerProps)
  const { multiple, ...selectRest } = rest

  const value = useMemo(
    () => fieldValueToSelectValue(field.value, multiple),
    [field.value, multiple]
  )

  return (
    <Select
      size="xl"
      errorMessage={fieldState.error?.message}
      validationState={fieldState.invalid ? 'invalid' : undefined}
      {...selectRest}
      multiple={multiple}
      name={field.name}
      value={value}
      onUpdate={next => {
        if (multiple) {
          field.onChange(next)
        } else {
          field.onChange(next[0] ?? '')
        }
      }}
    />
  )
}
