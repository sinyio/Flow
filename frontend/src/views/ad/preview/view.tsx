'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button, Icon, Text, useToaster } from '@gravity-ui/uikit'
import { isAxiosError } from 'axios'

import { createAd, type TPackaging, type TAd } from '@api/ads'
import { getUser } from '@api/user/get-user'
import { useAxiosInstance } from '@api/use-axios-instance'
import { useCreateAdDraftStore } from '@utils/stores/create-ad-draft/store'
import { useCurrentUserStore } from '@utils/stores/current-user'
import { useResponsive } from '@utils/hooks/use-responsive'
import { normalizeApiMessage } from '@utils/session-not-found'

import { PageContainer } from '@components/global/page-container'
import { PenIcon } from '@components/svgr/pen-icon/icon'
import { AdName } from '@widgets/ad/ad-name'
import { AdHeader } from '@widgets/ad/ad-header'
import { AdDetails } from '@widgets/ad/ad-details'

import styles from './view.module.css'

export const AdPreviewView = () => {
  const router = useRouter()
  const axiosInstance = useAxiosInstance()
  const { values, previewUrl, clear } = useCreateAdDraftStore()
  const { device } = useResponsive()
  const { fetch: fetchCurrentUser } = useCurrentUserStore()
  const { add } = useToaster()
  const [publishing, setPublishing] = useState(false)
  const [authorName, setAuthorName] = useState('')
  const [authorPhoto, setAuthorPhoto] = useState<string | null>(null)
  const published = useRef(false)

  useEffect(() => {
    if (!values && !published.current) router.replace('/ads')
  }, [values, router])

  useEffect(() => {
    fetchCurrentUser(axiosInstance).then((id) => {
      if (!id) return
      getUser(id, axiosInstance).then((res) => {
        const user = res.data
        if ('id' in user) {
          setAuthorName(`${user.firstName} ${user.lastName}`.trim())
          setAuthorPhoto(user.photo ?? null)
        }
      }).catch(() => {})
    })
  }, [axiosInstance, fetchCurrentUser])

  if (!values) return null

  const [fromCity, toCity] = values.routeKey.split('__')

  const ad: TAd = {
    id: 'preview',
    title: values.title,
    image: previewUrl,
    description: values.description,
    status: 'ACTIVE',
    startDate: values.startDate,
    endDate: values.endDate,
    fromCity: fromCity ?? '',
    toCity: toCity ?? '',
    price: Number(values.price),
    weight: Number(values.weight),
    isFragile: values.isFragile,
    isDocument: values.isDocument,
    packaging: values.packaging as TPackaging,
    length: Number(values.length),
    width: Number(values.width),
    height: Number(values.height),
    userState: {
      canEdit: false,
      role: 'viewer',
      responseCount: 0,
      hasResponded: false,
      chatId: null,
    },
    author: { id: 'preview', fullName: authorName, photo: authorPhoto },
    sender: null,
    recipient: null,
    courier: null,
  }

  const handlePublish = async () => {
    if (!values.image) return
    setPublishing(true)
    try {
      const { data } = await createAd(
        {
          title: values.title.trim(),
          startDate: values.startDate,
          endDate: values.endDate,
          fromCity: fromCity ?? '',
          toCity: toCity ?? '',
          weight: Number(values.weight),
          length: Number(values.length),
          width: Number(values.width),
          height: Number(values.height),
          price: Number(values.price),
          packaging: values.packaging as TPackaging,
          role: values.role,
          isFragile: values.isFragile,
          isDocument: values.isDocument,
          description: values.description.trim() || undefined,
          image: values.image,
        },
        axiosInstance,
      )
      if ('status' in data && data.status === 'ok') {
        published.current = true
        clear()
        add({
          isClosable: true,
          theme: 'success',
          name: 'create_ad_ok',
          title: 'Готово',
          content: 'Объявление создано.',
        })
        console.log(data)
        router.push(`/ads/${data.id}`)
      }
    } catch (error: unknown) {
      let message = 'Произошла ошибка при публикации'
      if (isAxiosError(error)) {
        const body = error.response?.data as { message?: unknown } | undefined
        message = normalizeApiMessage(body?.message) ?? error.message ?? message
      }
      alert(message)
    } finally {
      setPublishing(false)
    }
  }

  const actions = (
    <div className={styles.actions}>
      <Button
        view="action"
        size="xl"
        width="max"
        onClick={handlePublish}
        loading={publishing}
      >
        <Text variant="header-1">Опубликовать</Text>
      </Button>
      <Button
        view="normal"
        size="l"
        width="max"
        className={styles.editButton}
        onClick={() => router.push('/ads')}
      >
        <Icon data={PenIcon} size={20} />
        <Text variant="header-1">Редактировать</Text>
      </Button>
    </div>
  )

  if (device === 'mobile') {
    return (
      <PageContainer inner={{ className: styles.adPageInner }}>
        <>
          <AdHeader
            imageUrl={ad.image || ''}
            title={ad.title}
            price={ad.price}
            authorName={ad.author.fullName || ''}
            authorAvatarUrl={ad.author.photo || ''}
            adId={ad.id}
            canEdit={false}
            hideActions
            hideHeader
          />
          <div style={{ padding: '0 16px' }}>
            <AdDetails ad={ad} />
            {actions}
          </div>
        </>
      </PageContainer>
    )
  }

  return (
    <>
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.adName}>
            <AdName
              title={ad.title}
              price={ad.price}
              authorName={ad.author.fullName}
              authorAvatarUrl={ad.author.photo || ''}
              isBackdrop={false}
              adId={ad.id}
              canEdit={false}
              hideActions
            />
          </div>
        </div>
        <Image priority fill alt="" src={ad.image || ''} className={styles.backgroundImage} />
      </div>

      <PageContainer
        outer={{ className: styles.adPageOuter }}
        inner={{ className: styles.adPageInner }}
      >
        <div style={{ position: 'relative' }}>
          <Image
            priority
            width={455}
            height={606}
            alt=""
            src={ad.image || ''}
            className={styles.adImage}
          />
        </div>
        <div className={styles.rightSide}>
          <AdDetails ad={ad} />
          {actions}
        </div>
      </PageContainer>
    </>
  )
}
