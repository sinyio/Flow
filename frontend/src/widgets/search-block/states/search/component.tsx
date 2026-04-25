'use client'

import { Button, Text, TextProps } from '@gravity-ui/uikit'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'

import { TGetPopularRoutesResponse } from '@api/ads'

import { buildSearchUrl } from '@utils/build-search-url'
import { useResponsive } from '@utils/hooks/use-responsive'

import { DatePickerField, MoneyField, SelectField } from '@components/form'

import styles from './component.module.css'
import { heroSearchSchema, THeroSearchValues } from './config'

export interface ISearchStateProps {
  routes?: TGetPopularRoutesResponse
}

const SearchState = ({ routes }: ISearchStateProps) => {
  const router = useRouter()
  const { device } = useResponsive()
  const headerText = useMemo(
    () => ({ mobile: 'display-1', tablet: 'display-2', desktop: 'display-3' })[device],
    [device]
  ) as TextProps['variant']

  const routeOptions = useMemo(
    () =>
      Array.isArray(routes)
        ? routes.map(r => ({
            value: `${r.fromCity}__${r.toCity}`,
            content: `${r.fromCity} – ${r.toCity} (${r.totalAds})`,
          }))
        : [],
    [routes]
  )

  const { control, handleSubmit, watch } = useForm<THeroSearchValues>({
    defaultValues: { routeKey: '', startDate: '', endDate: '', minPrice: '' },
    mode: 'onChange',
    resolver: zodResolver(heroSearchSchema),
  })

  const routeKey = watch('routeKey')

  const onSubmit = (values: THeroSearchValues) => {
    const [fromCity, toCity] = (values.routeKey ?? '').split('__')

    if (!fromCity || !toCity) return

    const minPriceNum =
      values.minPrice && !Number.isNaN(Number(values.minPrice.replace('₽', '')))
        ? Number(values.minPrice.replace('₽', ''))
        : undefined

    router.push(
      buildSearchUrl({
        page: 1,
        fromCity,
        toCity,
        startDate: values.startDate || undefined,
        endDate: values.endDate || undefined,
        minPrice: minPriceNum,
      })
    )
  }

  return (
    <>
      <Text variant={headerText} className={styles.heroTitle} as="h1">
        Здесь путешественники помогают друг другу
      </Text>

      <form className={styles.searchGrid} onSubmit={handleSubmit(onSubmit)}>
        <SelectField
          size="xl"
          placeholder="Найти направление"
          options={routeOptions}
          controllerProps={{ control, name: 'routeKey' }}
          width="max"
        />

        <div className={styles.inputsRow}>
          <DatePickerField
            size="xl"
            placeholder="От"
            controllerProps={{ control, name: 'startDate' }}
          />

          <DatePickerField
            size="xl"
            placeholder="До"
            controllerProps={{ control, name: 'endDate' }}
          />

          <MoneyField
            size="xl"
            placeholder="Оплата"
            controllerProps={{ control, name: 'minPrice' }}
          />
        </div>

        <Button type="submit" view="action" size="xl" className={styles.searchButton} width={device === 'mobile' ? 'max' : 'auto'} disabled={!routeKey}>
          <Text variant="header-1">Найти</Text>
        </Button>
      </form>
    </>
  )
}

export default SearchState
