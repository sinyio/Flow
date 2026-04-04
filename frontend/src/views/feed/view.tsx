'use client'

import type { TAdPaginatedResponse, TGetAdsParams, TGetPopularRoutesResponse } from '@api/ads'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { Button, Icon, Label, Text, TextInput } from '@gravity-ui/uikit'

import { Card } from '@components/templates/card'
import { getPopularRoutes } from '@api/ads'
import { PageContainer } from '@components/global/page-container'
import { ArrowIcon } from '@components/svgr/arrow-icon/icon'
import { CompassIcon } from '@components/svgr/compass-icon/icon'
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

const fallbackRoutes: TRoutesOption[] = [
  {
    value: 'moscow__tbilisi',
    content: 'Москва – Тбилиси',
    count: 5,
    fromCity: 'Москва',
    toCity: 'Тбилиси',
  },
  {
    value: 'tbilisi__moscow',
    content: 'Тбилиси – Москва',
    count: 2,
    fromCity: 'Тбилиси',
    toCity: 'Москва',
  },
]

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
  const routeItems = routes.length ? routes : fallbackRoutes

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

  const routeMeta = [
    query.startDate && query.endDate ? `${query.startDate} – ${query.endDate}` : null,
  ]
    .concat(typeof query.minPrice === 'number' ? [`от ${query.minPrice} ₽`] : [])
    .filter(Boolean)
    .join('  ')

  return (
    <>
      <div className={styles.hero}>
        <div className={styles.heroImage} aria-hidden="true" />

        <div className={styles.heroInner}>
          <Text variant="caption-2" className={styles.heroPageTitle}>
            Лента
          </Text>
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
                <Text variant="caption-2" className={styles.heroMeta}>
                  {routeMeta || 'Параметры не выбраны'}
                </Text>
              </div>
            </div>
          ) : (
            <HeroSearch routes={routeItems} />
          )}
        </div>
      </div>

      <PageContainer inner={{ className: styles.page }}>
        {isSearch ? (
          <>
            <div className={styles.filtersRow}>
              <div className={styles.filtersUser}>JT</div>

              <div className={styles.filters}>
                {typeof query.maxWeight === 'number' ? (
                  <Label size="xs" theme="success">
                    До {query.maxWeight} кг
                  </Label>
                ) : null}
                <Label size="xs" theme="success">
                  Проверенный отправитель
                </Label>
                {query.isDocument ? (
                  <Label size="xs" theme="success">
                    До 5кг
                  </Label>
                ) : null}
                {query.isFragile ? (
                  <Label size="xs" theme="success">
                    Хрупкое
                  </Label>
                ) : null}
              </div>
            </div>

            <div className={styles.searchList}>
              {data.data.map(ad => (
                <DeliveryPreviewCard withBadges key={ad.id} ad={ad} />
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

            <section className={styles.subscribeSection}>
              <Text variant="header-2" className={styles.subscribeTitle}>
                Не нашли подходящее объявление?
              </Text>
              <Text variant="body-2" color="secondary" className={styles.subscribeText}>
                Подпишитесь на email уведомления по выбранному направлению
              </Text>
              <Button view="action" size="xl" className={styles.subscribeButton}>
                Подписаться
              </Button>
            </section>
          </>
        ) : (
          <>
            <section className={styles.section}>
              <Text variant="header-2" className={styles.sectionTitle}>
                Популярные
              </Text>
              <div className={styles.popular}>
                {routeItems.slice(0, 2).map(r => (
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
                    <span className={styles.popularIcon} aria-hidden="true">
                      <Icon data={CompassIcon} />
                    </span>
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
                <Button view="action" size="xl">
                  Читать больше в нашем медиа
                </Button>
              </div>
            </section>

            <section className={styles.section}>
              <Text variant="header-2" className={styles.sectionTitle}>
                Новые объявления
              </Text>

              <div className={styles.list}>
                {data.data.slice(0, 2).map(ad => (
                  <DeliveryPreviewCard key={ad.id} ad={ad} />
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

const formatDate = (value?: string) => {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
}

const formatRange = (startDate?: string, endDate?: string) => {
  const start = formatDate(startDate)
  const end = formatDate(endDate)

  if (!start && !end) return 'Дата не указана'
  if (!start) return end
  if (!end) return start

  const year = endDate ? new Date(endDate).getFullYear() : ''

  return `${start} – ${end}${year ? ` ${year}` : ''}`
}

const DeliveryPreviewCard = ({
  ad,
  withBadges = false,
}: {
  ad: TAdPaginatedResponse['data'][number]
  withBadges?: boolean
}) => (
  <Card className={styles.deliveryCard}>
    <div className={styles.deliveryInner}>
      {withBadges ? (
        <div className={styles.deliveryBadges}>
          <Label size="xs" theme="success">
            Проверенный отправитель
          </Label>
        </div>
      ) : null}

      <div className={styles.deliveryRow}>
        <div className={styles.deliveryImage}>
          <Image fill alt="" src={ad.image || '/profile/item.png'} />
        </div>

        <div className={styles.deliveryContent}>
          <Text variant="display-1" className={styles.deliveryPrice}>
            {ad.price} ₽
          </Text>
          <Text variant="subheader-2" className={styles.deliveryRoute}>
            {ad.fromCity} – {ad.toCity}
          </Text>
          <Text variant="body-2" color="secondary">
            {formatRange(ad.startDate, ad.endDate)}
          </Text>
        </div>
      </div>
    </div>
  </Card>
)

const MediaCard = ({ title }: { title: string }) => (
  <div className={styles.mediaCard}>
    <div className={styles.mediaImage}>
      <Image fill alt="" src="/profile/item.png" />
    </div>
    <Text variant="subheader-2" className={styles.mediaTitle}>
      {title}
    </Text>
  </div>
)

const HeroSearch = ({ routes }: { routes: TRoutesOption[] }) => {
  const router = useRouter()
  const { device } = useResponsive()

  const [routeQuery, setRouteQuery] = useState('')
  const [selectedRoute, setSelectedRoute] = useState<TRoutesOption | null>(null)
  const [isRouteDropdownOpen, setIsRouteDropdownOpen] = useState(false)
  const [dateRange, setDateRange] = useState('08.04 - 14.04')
  const [minPrice, setMinPrice] = useState('500')

  const filteredRoutes = useMemo(() => {
    const q = routeQuery.trim().toLowerCase()

    if (!q) return routes.slice(0, 6)

    return routes.filter(route => route.content.toLowerCase().includes(q)).slice(0, 6)
  }, [routes, routeQuery])

  const splitDateRange = (value: string) => {
    const [start = '', end = ''] = value.split('-').map(part => part.trim())

    return { startDate: start || undefined, endDate: end || undefined }
  }

  const submitSearch = () => {
    const routeToSearch = selectedRoute ?? filteredRoutes[0]
    const parsedDates = splitDateRange(dateRange)

    router.push(
      buildSearchUrl({
        fromCity: routeToSearch?.fromCity || undefined,
        toCity: routeToSearch?.toCity || undefined,
        startDate: parsedDates.startDate,
        endDate: parsedDates.endDate,
        minPrice: minPrice || undefined,
        page: 1,
      })
    )
  }

  return (
    <div className={styles.heroCard}>
      <Text variant={device === 'mobile' ? 'header-2' : 'display-1'} className={styles.heroTitle}>
        Здесь путешественники помогают друг другу
      </Text>

      <div className={styles.searchGrid}>
        <TextInput
          size="xl"
          placeholder="Найти направление"
          value={routeQuery}
          onUpdate={value => {
            setRouteQuery(value)
            setIsRouteDropdownOpen(true)
          }}
          onFocus={() => setIsRouteDropdownOpen(true)}
          className={styles.searchInput}
        />

        {isRouteDropdownOpen && filteredRoutes.length ? (
          <div className={styles.routesDropdown}>
            {filteredRoutes.map(route => (
              <button
                key={route.value}
                type="button"
                className={styles.routesDropdownItem}
                onClick={() => {
                  setSelectedRoute(route)
                  setRouteQuery(route.content)
                }}
              >
                {route.content}
              </button>
            ))}

            <div className={styles.routesDropdownActions}>
              <Button
                view="flat"
                size="m"
                onClick={() => {
                  setSelectedRoute(null)
                  setIsRouteDropdownOpen(false)
                }}
              >
                Отмена
              </Button>
              <Button view="action" size="m" onClick={() => setIsRouteDropdownOpen(false)}>
                Выбрать
              </Button>
            </div>
          </div>
        ) : null}

        <div className={styles.searchMetaRow}>
          <TextInput
            size="xl"
            placeholder="Дата"
            value={dateRange}
            onUpdate={setDateRange}
            className={styles.searchInput}
          />
          <TextInput
            size="xl"
            placeholder="Оплата"
            value={minPrice}
            onUpdate={setMinPrice}
            className={styles.searchInput}
          />
        </div>
        <Button view="action" size="xl" className={styles.searchButton} onClick={submitSearch}>
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
