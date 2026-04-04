import { DatePicker, DatePickerProps } from '@gravity-ui/date-components'
import { dateTimeParse, isDateTime } from '@gravity-ui/date-utils'
import type { DateTime } from '@gravity-ui/date-utils'
import { useMemo } from 'react'
import { FieldValues, useController, UseControllerProps } from 'react-hook-form'

function formValueToDateTime(value: unknown): DateTime | null {
  if (value === null || value === undefined || value === '') {
    return null
  }

  if (isDateTime(value)) {
    return value
  }

  if (typeof value === 'string') {
    const parsed = dateTimeParse(value, { allowRelative: false })

    return parsed ?? null
  }

  return null
}

function dateTimeToFormValue(value: DateTime | null): string {
  if (!value) {
    return ''
  }

  return value.format('YYYY-MM-DD')
}

interface IDatePickerProps<T extends FieldValues> extends DatePickerProps {
  controllerProps: UseControllerProps<T>
}

export const DatePickerField = <T extends FieldValues>({
  controllerProps,
  ...rest
}: IDatePickerProps<T>) => {
  const { field, fieldState } = useController(controllerProps)

  const value = useMemo(() => formValueToDateTime(field.value), [field.value])

  return (
    <DatePicker
      size="xl"
      errorMessage={fieldState.error?.message}
      validationState={fieldState.invalid ? 'invalid' : undefined}
      name={field.name}
      value={value}
      onUpdate={next => {
        field.onChange(dateTimeToFormValue(next))
      }}
      onBlur={field.onBlur}
      {...rest}
    />
  )
}
