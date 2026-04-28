'use client'

import { Button, Icon, Text, useToaster } from '@gravity-ui/uikit'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { z } from 'zod'

import { createPost } from '@api/media/create-post'

import { useApiContext } from '@contexts/api-context'

import { normalizeContent } from '@utils/normalize-content'

import { ImageUploadPreview } from '@components/form/image-upload'
import { TextAreaField } from '@components/form/text-area-field/field'
import { TextField } from '@components/form/text-field/field'
import { PageContainer } from '@components/global/page-container'
import { ArrowIcon } from '@components/svgr/arrow-icon/icon'

import styles from './page.module.css'

const CONTENT_MAX = 10_000

const schema = z.object({
  title: z.string().min(1, 'Введите заголовок').max(200),
  content: z
    .string()
    .max(CONTENT_MAX, `Максимум ${CONTENT_MAX.toLocaleString()} символов`)
    .optional(),
})

type TFormValues = z.infer<typeof schema>

export const NewPostPage = () => {
  const router = useRouter()
  const { apiClient } = useApiContext()
  const { add } = useToaster()
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const { control, handleSubmit, formState, watch } = useForm<TFormValues>({
    defaultValues: { title: '', content: '' },
    mode: 'onChange',
    resolver: zodResolver(schema),
  })

  const handleFileSelect = (file: File) => {
    if (preview) URL.revokeObjectURL(preview)
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleRemove = () => {
    setImage(null)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
  }

  const onSubmit: SubmitHandler<TFormValues> = async data => {
    setSubmitting(true)
    try {
      const { data: body } = await createPost(
        { title: data.title, content: normalizeContent(data.content), image: image ?? undefined },
        apiClient
      )

      if ('status' in body && body.status === 'ok') {
        add({
          isClosable: true,
          theme: 'success',
          name: 'create_post_success',
          title: 'Пост опубликован',
        })
        router.push(`/media/posts/${body.id}`)

        return
      }

      add({
        isClosable: true,
        theme: 'warning',
        name: 'create_post_error',
        title: 'Ошибка',
        content: 'message' in body ? body.message : 'Не удалось опубликовать пост',
      })
    } catch (error) {
      let message = 'Произошла ошибка при публикации'

      if (isAxiosError(error)) {
        const err = error.response?.data as { message?: string } | undefined

        message = err?.message ?? error.message ?? message
      }
      add({
        isClosable: true,
        theme: 'warning',
        name: 'create_post_error',
        title: 'Ошибка',
        content: message,
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className={styles.gap} />

      <PageContainer inner={{ className: styles.page }}>
        <div className={styles.headerRow}>
          <Button
            view="normal"
            size="l"
            className={styles.backButton}
            aria-label="Назад"
            onClick={() => router.push('/media')}
          >
            <Icon data={ArrowIcon} />
          </Button>

          <Text variant="display-3" className={styles.title}>
            Новый пост
          </Text>
        </div>

        <div className={styles.divider} />

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.section}>
            <Text variant="header-2">Напишите свою историю</Text>
            <div className={styles.fields}>
              <TextField
                size="xl"
                placeholder="Заголовок"
                controllerProps={{ control, name: 'title' }}
              />
              <TextAreaField
                size="xl"
                placeholder="Ваш текст"
                minRows={6}
                controllerProps={{ control, name: 'content' }}
                note={
                  (watch('content')?.length ?? 0) > CONTENT_MAX * 0.8
                    ? `${watch('content')?.length ?? 0} / ${CONTENT_MAX.toLocaleString()}`
                    : undefined
                }
              />
            </div>
          </div>

          <div className={styles.section}>
            <Text variant="header-2">Добавьте обложку</Text>
            <ImageUploadPreview
              preview={preview}
              onFileSelect={handleFileSelect}
              onRemove={handleRemove}
            />
          </div>

          <Text variant="body-2" color="secondary">
            Ваш текст будет опубликован в{' '}
            <span className={styles.link} onClick={() => router.push('/media')}>
              Медиа
            </span>{' '}
            после проверки модератором.
          </Text>

          <div className={styles.submitBlock}>
            <Button
              type="submit"
              size="xl"
              view="action"
              className={styles.submitButton}
              disabled={!formState.isValid || submitting}
              loading={submitting}
            >
              Опубликовать
            </Button>
            <Text variant="caption-1" color="secondary" className={styles.terms}>
              Нажимая «Опубликовать», вы принимаете{' '}
              <span className={styles.termsLink}>условия соглашения</span> и{' '}
              <span className={styles.termsLink}>политику конфиденциальности</span>.
            </Text>
          </div>
        </form>
      </PageContainer>
    </>
  )
}
