'use client'

import type { TEditAdFormValues } from './types'
import { Button, Switch, Text, useToaster } from '@gravity-ui/uikit'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'

import { updateAd, getPopularRoutes, type TPackaging, type TAd } from '@api/ads'
import { useAxiosInstance } from '@api/use-axios-instance'

import { normalizeApiMessage } from '@utils/session-not-found'

import { DatePickerField } from '@components/form/date-picker-field/field'
import { ImageUploadPreview } from '@components/form/image-upload'
import { SelectField } from '@components/form/select-field/field'
import { TextAreaField } from '@components/form/text-area-field/field'
import { TextField } from '@components/form/text-field/field'

import styles from './component.module.css'
import { editAdSchema } from './validation-schema'

const packagingOptions: Array<{ value: TPackaging; content: string }> = [
  { value: 'BOX', content: 'Коробка' },
  { value: 'PACKAGE', content: 'Пакет' },
  { value: 'ENVELOPE', content: 'Конверт' },
  { value: 'FILM', content: 'Плёнка' },
  { value: 'NO_PACKAGING', content: 'Без упаковки' },
  { value: 'OTHER', content: 'Другое' },
]

const toRouteKey = (fromCity: string, toCity: string) => `${fromCity}__${toCity}`

interface IEditAdFormProps {
  ad: TAd
}

export const EditAdForm = ({ ad }: IEditAdFormProps) => {
  const axiosInstance = useAxiosInstance()
  const router = useRouter()
  const { add } = useToaster()

  const [routes, setRoutes] = useState<Array<{ value: string; content: string }>>([])
  const [preview, setPreview] = useState<string | null>(ad.image)

  const { control, handleSubmit, setValue, watch, formState } = useForm<TEditAdFormValues>({
    defaultValues: {
      routeKey: toRouteKey(ad.fromCity, ad.toCity),
      startDate: ad.startDate,
      endDate: ad.endDate,
      title: ad.title,
      role: ad.userState.role === 'recipient' ? 'recipient' : 'sender',
      isDocument: ad.isDocument,
      isFragile: ad.isFragile,
      packaging: ad.packaging,
      weight: String(ad.weight),
      length: String(ad.length),
      width: String(ad.width),
      height: String(ad.height),
      price: String(ad.price),
      description: ad.description ?? '',
      image: null,
    },
    mode: 'onChange',
    resolver: zodResolver(editAdSchema) as never,
  })

  const role = watch('role')

  useEffect(() => {
    let alive = true
    const currentRouteKey = toRouteKey(ad.fromCity, ad.toCity)
    const currentRouteLabel = `${ad.fromCity} – ${ad.toCity}`

    getPopularRoutes(axiosInstance)
      .then(res => {
        if (!alive) return
        const data = res.data
        if (!Array.isArray(data)) return

        const mappedRoutes = data.map(r => ({
          value: toRouteKey(r.fromCity, r.toCity),
          content: `${r.fromCity} – ${r.toCity}`,
        }))

        if (!mappedRoutes.find(r => r.value === currentRouteKey)) {
          mappedRoutes.unshift({ value: currentRouteKey, content: currentRouteLabel })
        }

        setRoutes(mappedRoutes)
      })
      .catch(() => {
        if (!alive) return
        setRoutes([{ value: currentRouteKey, content: currentRouteLabel }])
      })

    return () => {
      alive = false
    }
  }, [axiosInstance, ad.fromCity, ad.toCity])

  const handleFileSelect = (file: File) => {
    if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview)
    setValue('image', file, { shouldValidate: true })
    setPreview(URL.createObjectURL(file))
  }

  const handleRemove = () => {
    if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview)
    setValue('image', null, { shouldValidate: true })
    setPreview(null)
  }

  const onSubmit: SubmitHandler<TEditAdFormValues> = async values => {
    const [fromCity, toCity] = values.routeKey.split('__')

    if (!fromCity || !toCity) return

    try {
      const { data } = await updateAd(
        {
          id: ad.id,
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
          description: values.description?.trim() || undefined,
          ...(values.image ? { image: values.image } : {}),
        },
        axiosInstance
      )

      if ('status' in data && data.status === 'ok') {
        add({
          isClosable: true,
          theme: 'success',
          name: 'edit_ad_ok',
          title: 'Готово',
          content: 'Объявление обновлено.',
        })
        router.push(`/ads/${ad.id}`)

        return
      }

      const apiMessage = 'message' in data ? data.message : 'Не удалось обновить объявление'

      add({
        isClosable: true,
        theme: 'warning',
        name: 'edit_ad_error',
        title: 'Ошибка',
        content: apiMessage,
      })
    } catch (error: unknown) {
      let message = 'Произошла ошибка при обновлении объявления'

      if (isAxiosError(error)) {
        const body = error.response?.data as { message?: unknown } | undefined

        message = normalizeApiMessage(body?.message) ?? error.message ?? message
      }

      add({
        isClosable: true,
        theme: 'warning',
        name: 'edit_ad_error',
        title: 'Ошибка',
        content: message,
      })
    }
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
            options={routes}
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

        <ImageUploadPreview
          preview={preview}
          onFileSelect={handleFileSelect}
          onRemove={handleRemove}
        />

        <div className={styles.fields}>
          <SelectField
            label="Упаковка:"
            placeholder="Выберите вариант"
            options={packagingOptions}
            controllerProps={{ control, name: 'packaging' }}
            width="max"
          />

          <TextField
            label="Вес посылки:"
            placeholder="кг"
            controllerProps={{ control, name: 'weight' }}
          />
          <TextField
            label="Длина:"
            placeholder="см"
            controllerProps={{ control, name: 'length' }}
          />
          <TextField
            label="Ширина:"
            placeholder="см"
            controllerProps={{ control, name: 'width' }}
          />
          <TextField
            label="Высота:"
            placeholder="см"
            controllerProps={{ control, name: 'height' }}
          />
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
          Сохранить
        </Button>
      </div>
    </form>
  )
}
