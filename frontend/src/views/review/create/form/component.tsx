'use client'

import { Button, Switch, Text, useToaster } from '@gravity-ui/uikit'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { createReview } from '@api/reviews'
import { useAxiosInstance } from '@api/use-axios-instance'

import { normalizeApiMessage } from '@utils/session-not-found'

import { RatingSelector } from '@components/atoms/rating-selector'
import { FileField, TextAreaField } from '@components/form'
import { Card } from '@components/templates/card'

import styles from './component.module.css'
import { TCreateReviewFormValues } from './types'
import { createReviewSchema } from './validation-schema'

export interface ICreateReviewFormProps {
  adId: string
  title: string
}

export const CreateReviewForm = ({ adId, title }: ICreateReviewFormProps) => {
  const axiosInstance = useAxiosInstance()
  const router = useRouter()
  const { add } = useToaster()

  const { control, handleSubmit, setValue, watch, formState } = useForm<
    TCreateReviewFormValues,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    TCreateReviewFormValues
  >({
    defaultValues: {
      rating: 0,
      text: '',
      isAnonymous: false,
      files: [],
    },
    mode: 'onChange',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createReviewSchema) as any,
  })

  const rating = watch('rating')
  const isAnonymous = watch('isAnonymous')

  const onSubmit = async (values: TCreateReviewFormValues) => {
    try {
      // Предупреждение о файлах (backend не поддерживает)
      if (values.files && values.files.length > 0) {
        console.warn('Backend пока не поддерживает загрузку файлов к отзывам')
      }

      // Отправляем только данные которые поддерживает backend
      await createReview(
        {
          adId,
          rating: values.rating,
          text: values.text || undefined,
          isAnonymous: values.isAnonymous,
        },
        axiosInstance
      )

      add({
        isClosable: true,
        theme: 'success',
        name: 'create_review_success',
        title: 'Готово',
        content: 'Отзыв опубликован',
      })

      // Редирект назад или на страницу объявления
      router.back()
    } catch (error) {
      const message = isAxiosError(error)
        ? normalizeApiMessage(error.response?.data?.message) || 'Не удалось создать отзыв'
        : 'Не удалось создать отзыв'

      add({
        isClosable: true,
        theme: 'danger',
        name: 'create_review_error',
        title: 'Ошибка',
        content: message,
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <Card className={styles.ratingCard}>
        <Text variant="subheader-2" className={styles.cardTitle}>
          {title}
        </Text>

        <RatingSelector
          value={rating}
          onChange={value => setValue('rating', value, { shouldValidate: true })}
          disabled={formState.isSubmitting}
        />

        {formState.errors.rating && (
          <Text variant="body-2" color="danger">
            {formState.errors.rating.message}
          </Text>
        )}
      </Card>

      <div className={styles.section}>
        <Text variant="subheader-2" className={styles.sectionTitle}>
          Как вам доставка?
        </Text>

        <TextAreaField
          placeholder="Общее впечатление"
          minRows={4}
          controllerProps={{ control, name: 'text' }}
          disabled={formState.isSubmitting}
        />
      </div>

      <Switch
        size="l"
        content="Анонимный отзыв"
        checked={isAnonymous}
        onUpdate={value => setValue('isAnonymous', value)}
        disabled={formState.isSubmitting}
        className={styles.switch}
      />

      <FileField
        multiple
        controllerProps={{ control, name: 'files' }}
        accept="image/*,.pdf,.doc,.docx"
        buttonText="Прикрепить файл"
        maxFiles={5}
      />

      <Button
        type="submit"
        view="action"
        size="xl"
        className={styles.submitButton}
        disabled={!formState.isValid || formState.isSubmitting}
        loading={formState.isSubmitting}
      >
        Отправить отзыв
      </Button>
    </form>
  )
}
