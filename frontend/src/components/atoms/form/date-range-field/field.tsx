'use client'

import { DatePicker } from '@gravity-ui/date-components'
import { dateTimeParse } from '@gravity-ui/date-utils'
import type { DateTime } from '@gravity-ui/date-utils'
import { Button, Modal, Text } from '@gravity-ui/uikit'
import { useState } from 'react'
import { Control, FieldValues, Path, useController } from 'react-hook-form'

import styles from './field.module.css'

interface IDateRangeFieldProps<T extends FieldValues> {
  control: Control<T>
  startName: Path<T>
  endName: Path<T>
  placeholder?: string
  size?: 'xl' | 'l' | 'm' | 's'
}

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1.5" y="2.5" width="13" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M1.5 6.5H14.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M5 1V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M11 1V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const formatDate = (iso: string) => {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

const stringToDateTime = (iso: string): DateTime | null => {
  if (!iso) return null
  return dateTimeParse(iso, { allowRelative: false }) ?? null
}

export const DateRangeField = <T extends FieldValues>({
  control,
  startName,
  endName,
  placeholder = 'Даты',
}: IDateRangeFieldProps<T>) => {
  const [isOpen, setIsOpen] = useState(false)
  const [tempStart, setTempStart] = useState<DateTime | null>(null)
  const [tempEnd, setTempEnd] = useState<DateTime | null>(null)

  const { field: startField } = useController({ control, name: startName })
  const { field: endField } = useController({ control, name: endName })

  const hasValue = !!(startField.value || endField.value)
  const label = hasValue
    ? [formatDate(startField.value), formatDate(endField.value)].filter(Boolean).join(' – ')
    : placeholder

  const handleOpen = () => {
    setTempStart(stringToDateTime(startField.value ?? ''))
    setTempEnd(stringToDateTime(endField.value ?? ''))
    setIsOpen(true)
  }

  const handleConfirm = () => {
    startField.onChange(tempStart ? tempStart.format('YYYY-MM-DD') : '')
    endField.onChange(tempEnd ? tempEnd.format('YYYY-MM-DD') : '')
    setIsOpen(false)
  }

  const handleCancel = () => setIsOpen(false)

  return (
    <>
      <Button
        type="button"
        view={hasValue ? 'outlined-action' : 'outlined'}
        size="xl"
        width="max"
        onClick={handleOpen}
      >
        <CalendarIcon />
        <Text
          variant="body-1"
          color={hasValue ? 'brand' : 'secondary'}
          className={styles.label}
        >
          {label}
        </Text>
      </Button>

      <Modal open={isOpen} onOpenChange={open => !open && handleCancel()}>
        <div className={styles.modal}>
          <Text variant="header-1">Выберите даты</Text>

          <div className={styles.fields}>
            <div className={styles.fieldRow}>
              <Text variant="body-2" color="secondary">От</Text>
              <DatePicker
                size="xl"
                placeholder="ДД.ММ.ГГГГ"
                value={tempStart}
                onUpdate={val => setTempStart(val)}
              />
            </div>
            <div className={styles.fieldRow}>
              <Text variant="body-2" color="secondary">До</Text>
              <DatePicker
                size="xl"
                placeholder="ДД.ММ.ГГГГ"
                value={tempEnd}
                onUpdate={val => setTempEnd(val)}
              />
            </div>
          </div>

          <div className={styles.actions}>
            <Button size="xl" view="normal" className={styles.actionBtn} onClick={handleCancel}>
              <Text variant="header-1">Отмена</Text>
            </Button>
            <Button size="xl" view="action" className={styles.actionBtn} onClick={handleConfirm}>
              <Text variant="header-1">Выбрать</Text>
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
