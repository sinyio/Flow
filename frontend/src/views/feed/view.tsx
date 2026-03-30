'use client'

import type { TAdPaginatedResponse, TGetAdsParams, TGetPopularRoutesResponse } from '@api/ads'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button, Icon, Label, Text, TextInput } from '@gravity-ui/uikit'
import { AdCard } from '@entities/ad'

import { getPopularRoutes } from '@api/ads'
import { PageContainer } from '@components/global/page-container'
import { ArrowIcon } from '@components/svgr/arrow-icon/icon'
import { useResponsive } from '@utils/hooks/use-responsive'
import styles from './view.module.css'
import { useAxiosInstance } from '@api/use-axios-instance'

export interface IFeedViewProps {
  initial: TAdPaginatedResponse
  query: TGetAdsParams
  isSearch: boolean
}

type TRoutesOption = {
  value: string
  content: string
  count: number
  fromCity: string
  toCity: string
}

const buildSearchUrl = (params: Record<string, string | number | boolean | undefined>) => {
  const sp = new URLSearchParams()

  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === '' || v === false) return
    sp.set(k, String(v))
  })
  const q = sp.toString()

  return q ? `/?${q}` : '/'
}

export const FeedView = ({ initial, query, isSearch }: IFeedViewProps) => {
  const axiosInstance = useAxiosInstance()
  const { device } = useResponsive()
  const router = useRouter()

  const [data, setData] = useState<TAdPaginatedResponse>(initial)
  const [routes, setRoutes] = useState<TRoutesOption[]>([])
  const [loading, setLoading] = useState(false)

  const canPrev = data.meta.page > 1
  const canNext = data.meta.page < data.meta.pages

  useEffect(() => {
    let alive = true

    setLoading(false)

    getPopularRoutes(axiosInstance)
      .then(res => {
        if (!alive) return
        const d: TGetPopularRoutesResponse = res.data

        if (!Array.isArray(d)) return

        const normalized = d.map(r => ({
          value: `${r.fromCity}__${r.toCity}`,
          content: `${r.fromCity} – ${r.toCity}`,
          count: r.totalAds,
          fromCity: r.fromCity,
          toCity: r.toCity,
        }))

        setRoutes(normalized)
      })
      .catch(() => {})

    return () => {
      alive = false
    }
  }, [axiosInstance])

  useEffect(() => {
    setData(initial)
  }, [initial])

  const title =
    isSearch && query.fromCity && query.toCity
      ? `${query.fromCity} – ${query.toCity}`
      : 'Лента объявлений'

  return (
    <>
      <div className={styles.hero}>
        <div className={styles.heroImage} aria-hidden="true" />

        <div className={styles.heroInner}>
          {isSearch ? (
            <div className={styles.heroCard}>
              <Button
                view="normal"
                size="l"
                className={styles.heroBackButton}
                aria-label="Назад"
                onClick={() => router.push('/')}
              >
                <Icon data={ArrowIcon} />
              </Button>

              <div className={styles.heroRouteTitle}>
                <Text
                  variant={device === 'mobile' ? 'header-2' : 'display-1'}
                  className={styles.heroTitle}
                >
                  {title}
                </Text>
                <Text variant="body-2" color="secondary">
                  {query.startDate && query.endDate
                    ? `${query.startDate} – ${query.endDate}`
                    : null}
                </Text>
                <Text variant="body-2" color="secondary">
                  {typeof query.minPrice === 'number' ? `от ${query.minPrice} ₽` : null}
                </Text>
              </div>
            </div>
          ) : (
            <HeroSearch routes={routes} />
          )}
        </div>
      </div>

      <PageContainer inner={{ className: styles.page }}>
        {isSearch ? (
          <>
            <div className={styles.filtersRow}>
              <Label size="xs" theme="info" className={styles.filtersIcon}>
                1f
              </Label>

              <div className={styles.filters}>
                {typeof query.maxWeight === 'number' ? (
                  <Label size="xs" theme="success">
                    До {query.maxWeight}кг
                  </Label>
                ) : null}
                {query.isDocument ? (
                  <Label size="xs" theme="info">
                    Документы
                  </Label>
                ) : null}
                {query.isFragile ? (
                  <Label size="xs" theme="warning">
                    Хрупкое
                  </Label>
                ) : null}
              </div>
            </div>

            <div className={styles.list}>
              {data.data.map(ad => (
                <AdCard key={ad.id} {...ad} />
              ))}
            </div>

            <div className={styles.pagination}>
              <Button
                view="flat"
                size="l"
                disabled={!canPrev || loading}
                onClick={() => {
                  setLoading(true)
                  router.push(buildSearchUrl({ ...query, page: data.meta.page - 1 }))
                }}
              >
                ‹
              </Button>
              <Text variant="body-2" color="secondary">
                {data.meta.page} / {data.meta.pages}
              </Text>
              <Button
                view="flat"
                size="l"
                disabled={!canNext || loading}
                onClick={() => {
                  setLoading(true)
                  router.push(buildSearchUrl({ ...query, page: data.meta.page + 1 }))
                }}
              >
                ›
              </Button>
            </div>
          </>
        ) : (
          <>
            <section className={styles.section}>
              <Text variant="header-2" className={styles.sectionTitle}>
                Популярные
              </Text>
              <div className={styles.popular}>
                {routes.slice(0, 2).map(r => (
                  <button
                    key={r.value}
                    className={styles.popularItem}
                    onClick={() =>
                      router.push(
                        buildSearchUrl({ fromCity: r.fromCity, toCity: r.toCity, page: 1 })
                      )
                    }
                    type="button"
                  >
                    <div className={styles.popularIcon} aria-hidden="true" />
                    <div className={styles.popularText}>
                      <Text variant="subheader-2">{r.content}</Text>
                      <Text variant="caption-1" color="secondary">
                        {r.count} объявлений
                      </Text>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.mediaGrid}>
                <MediaCard title="Как работает Флоу?" />
                <MediaCard title="Сколько стоит услуга?" />
              </div>
              <div className={styles.mediaActions}>
                <Button view="outlined" size="l">
                  Читать больше в нашем медиа
                </Button>
              </div>
            </section>

            <section className={styles.section}>
              <Text variant="header-2" className={styles.sectionTitle}>
                Новые объявления
              </Text>

              <div className={styles.list}>
                {data.data.slice(0, 6).map(ad => (
                  <AdCard key={ad.id} {...ad} />
                ))}
              </div>

              <div className={styles.actions}>
                <Button view="action" size="xl" onClick={() => router.push('/ads')}>
                  Создать объявление
                </Button>
              </div>
            </section>
          </>
        )}
      </PageContainer>
    </>
  )
}

export default FeedView

const MediaCard = ({ title }: { title: string }) => (
  <div className={styles.mediaCard}>
    <div className={styles.mediaImage}>
      <Image
        fill
        alt=""
        src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
      />
    </div>
    <Text variant="subheader-2" className={styles.mediaTitle}>
      {title}
    </Text>
  </div>
)

const HeroSearch = ({ routes }: { routes: TRoutesOption[] }) => {
  const router = useRouter()
  const { device } = useResponsive()

  const [fromCity, setFromCity] = useState('')
  const [toCity, setToCity] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [minPrice, setMinPrice] = useState('')

  return (
    <div className={styles.heroCard}>
      <Text variant={device === 'mobile' ? 'header-2' : 'display-1'} className={styles.heroTitle}>
        Здесь путешественники помогают друг другу
      </Text>

      <div className={styles.searchGrid}>
        <TextInput
          size="xl"
          placeholder="Откуда"
          value={fromCity}
          onUpdate={setFromCity}
          className={styles.searchInput}
        />
        <TextInput
          size="xl"
          placeholder="Куда"
          value={toCity}
          onUpdate={setToCity}
          className={styles.searchInput}
        />
        <TextInput
          size="xl"
          placeholder="Дата"
          value={startDate}
          onUpdate={setStartDate}
          className={styles.searchInput}
        />
        <TextInput
          size="xl"
          placeholder="Дата"
          value={endDate}
          onUpdate={setEndDate}
          className={styles.searchInput}
        />
        <TextInput
          size="xl"
          placeholder="Сколько"
          value={minPrice}
          onUpdate={setMinPrice}
          className={styles.searchInput}
        />
        <Button
          view="action"
          size="xl"
          className={styles.searchButton}
          onClick={() =>
            router.push(
              buildSearchUrl({
                fromCity: fromCity || undefined,
                toCity: toCity || undefined,
                startDate: startDate || undefined,
                endDate: endDate || undefined,
                minPrice: minPrice || undefined,
                page: 1,
              })
            )
          }
        >
          Найти
        </Button>
      </div>

      {routes.length ? (
        <div className={styles.searchHint}>
          <Text variant="caption-1" color="secondary">
            Например: {routes[0]?.content}
          </Text>
        </div>
      ) : null}
    </div>
  )
}
