'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { Button, Switch, Text } from '@gravity-ui/uikit'

import { createAd, getPopularRoutes, type TPackaging } from '@api/ads'
import { useAxiosInstance } from '@api/use-axios-instance'
import { SelectField } from '@components/form/select-field/field'
import { TextField } from '@components/form/text-field/field'
import { DatePickerField } from '@components/form/date-picker-field/field'
import { TextAreaField } from '@components/form/text-area-field/field'
import { createAdSchema } from './validation-schema'
import type { TCreateAdFormValues } from './types'
import styles from './component.module.css'

const packagingOptions: Array<{ value: TPackaging; content: string }> = [
  { value: 'BOX', content: 'Коробка' },
  { value: 'PACKAGE', content: 'Пакет' },
  { value: 'ENVELOPE', content: 'Конверт' },
  { value: 'FILM', content: 'Плёнка' },
  { value: 'NO_PACKAGING', content: 'Без упаковки' },
  { value: 'OTHER', content: 'Другое' },
]

const toRouteKey = (fromCity: string, toCity: string) => `${fromCity}__${toCity}`

export const CreateAdForm = () => {
  const axiosInstance = useAxiosInstance()
  const fileRef = useRef<HTMLInputElement | null>(null)

  const [routes, setRoutes] = useState<Array<{ value: string; content: string }>>([])

  const { control, handleSubmit, setValue, watch, formState } = useForm<TCreateAdFormValues>({
    defaultValues: {
      routeKey: '',
      startDate: '',
      endDate: '',
      title: '',
      role: 'sender',
      isDocument: false,
      isFragile: true,
      packaging: '',
      weight: '',
      length: '',
      width: '',
      height: '',
      price: '',
      description: '',
      image: null,
    },
    mode: 'onChange',
    resolver: zodResolver(createAdSchema) as never,
  })

  const role = watch('role')
  const image = watch('image')

  useEffect(() => {
    let alive = true

    getPopularRoutes(axiosInstance)
      .then(res => {
        const data = res.data
        if (!alive) return

        if (Array.isArray(data)) {
          setRoutes(
            data.map(r => ({
              value: toRouteKey(r.fromCity, r.toCity),
              content: `${r.fromCity} – ${r.toCity}`,
            }))
          )
        }
      })
      .catch(() => {
        // ignore: routes are optional for the form UX
      })

    return () => {
      alive = false
    }
  }, [axiosInstance])

  const routeOptions = useMemo(() => routes, [routes])

  const onSubmit: SubmitHandler<TCreateAdFormValues> = async values => {
    const [fromCity, toCity] = values.routeKey.split('__')

    if (!fromCity || !toCity || !values.image) {
      return
    }

    await createAd(
      {
        title: values.title.trim(),
        startDate: values.startDate,
        endDate: values.endDate,
        fromCity,
        toCity,
        weight: Number(values.weight),
        length: Number(values.length),
        width: Number(values.width),
        height: Number(values.height),
        price: Number(values.price),
        packaging: values.packaging as TPackaging,
        role: values.role,
        isFragile: values.isFragile,
        isDocument: values.isDocument,
        description: values.description.trim() ? values.description.trim() : undefined,
        image: values.image,
      },
      axiosInstance
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.section}>
        <Text variant="header-2" className={styles.sectionTitle}>
          Главное о задании
        </Text>

        <div className={styles.fields}>
          <SelectField
            label="Направление:"
            placeholder="Выберите маршрут"
            options={routeOptions}
            controllerProps={{ control, name: 'routeKey' }}
            width="max"
          />

          <div className={styles.datesRow}>
            <DatePickerField
              label="Дата начала:"
              controllerProps={{ control, name: 'startDate' }}
              placeholder="ДД.ММ.ГГГГ"
            />
            <DatePickerField
              label="Дата окончания:"
              controllerProps={{ control, name: 'endDate' }}
              placeholder="ДД.ММ.ГГГГ"
            />
          </div>

          <TextField
            label="Название:"
            placeholder="Например: кроссовки"
            controllerProps={{ control, name: 'title' }}
          />
        </div>
      </div>

      <div className={styles.section}>
        <Text variant="header-2" className={styles.sectionTitle}>
          Ваша роль
        </Text>

        <div className={styles.roleGroup} role="tablist" aria-label="Ваша роль">
          <Button
            type="button"
            view="flat"
            size="xl"
            className={[
              styles.roleButton,
              role === 'sender' ? styles.roleButtonActive : undefined,
            ].join(' ')}
            onClick={() => setValue('role', 'sender', { shouldValidate: true })}
          >
            Отправитель
          </Button>
          <Button
            type="button"
            view="flat"
            size="xl"
            className={[
              styles.roleButton,
              role === 'recipient' ? styles.roleButtonActive : undefined,
            ].join(' ')}
            onClick={() => setValue('role', 'recipient', { shouldValidate: true })}
          >
            Получатель
          </Button>
        </div>
      </div>

      <div className={styles.section}>
        <Text variant="header-2" className={styles.sectionTitle}>
          Внешний вид посылки
        </Text>

        <div className={styles.toggles}>
          <Switch
            size="l"
            content="Доставка документов"
            checked={watch('isDocument')}
            onUpdate={next => setValue('isDocument', next, { shouldValidate: true })}
          />
          <Switch
            size="l"
            content="Хрупкое"
            checked={watch('isFragile')}
            onUpdate={next => setValue('isFragile', next, { shouldValidate: true })}
          />
        </div>

        <div className={styles.photoRow}>
          <input
            ref={fileRef}
            className={styles.hiddenFileInput}
            type="file"
            accept="image/*"
            onChange={e => {
              const file = e.target.files?.[0] ?? null
              setValue('image', file, { shouldValidate: true })
            }}
          />
          <Button
            type="button"
            view="action"
            size="xl"
            onClick={() => fileRef.current?.click()}
          >
            {image ? 'Фото добавлено' : 'Добавить фото'}
          </Button>
        </div>

        <div className={styles.fields}>
          <SelectField
            label="Упаковка:"
            placeholder="Выберите вариант"
            options={packagingOptions}
            controllerProps={{ control, name: 'packaging' }}
            width="max"
          />

          <TextField label="Вес посылки:" placeholder="кг" controllerProps={{ control, name: 'weight' }} />
          <TextField label="Длина:" placeholder="см" controllerProps={{ control, name: 'length' }} />
          <TextField label="Ширина:" placeholder="см" controllerProps={{ control, name: 'width' }} />
          <TextField label="Высота:" placeholder="см" controllerProps={{ control, name: 'height' }} />
        </div>
      </div>

      <div className={styles.section}>
        <Text variant="header-2" className={styles.sectionTitle}>
          Вознаграждение
        </Text>

        <div className={styles.fields}>
          <TextField label="" placeholder="₽" controllerProps={{ control, name: 'price' }} />
        </div>
      </div>

      <div className={styles.section}>
        <Text variant="header-2" className={styles.sectionTitle}>
          Дополнительно
        </Text>

        <TextAreaField
          placeholder="Добавьте описание задания"
          minRows={4}
          controllerProps={{ control, name: 'description' }}
        />
      </div>

      <div className={styles.submitWrap}>
        <Button
          type="submit"
          view="action"
          size="xl"
          className={styles.submitButton}
          disabled={!formState.isValid || formState.isSubmitting}
          loading={formState.isSubmitting}
        >
          Продолжить
        </Button>
      </div>
    </form>
  )
}

