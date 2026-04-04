import { Button, Text, TextProps } from '@gravity-ui/uikit'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { TGetPopularRoutesResponse } from '@api/ads'

import { buildSearchUrl } from '@utils/build-search-url'
import { useResponsive } from '@utils/hooks/use-responsive'

import { DatePickerField } from '@components/form/date-picker-field/field'
import { MoneyField } from '@components/form/money-field/field'
import { SelectField } from '@components/form/select-field/field'
import { LiquidGlassBlock } from '@components/global/liquid-glass-block'

import styles from './component.module.css'

const heroSearchSchema = z.object({
  routeKey: z.string().min(1, 'Выберите направление'),
  startDate: z.string().optional(),
  minPrice: z.string().optional(),
})

type THeroSearchValues = z.infer<typeof heroSearchSchema>

export const HeroSearch = ({ routes }: { routes: TGetPopularRoutesResponse }) => {
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

  const { control, handleSubmit } = useForm<THeroSearchValues>({
    defaultValues: { routeKey: '', startDate: '', minPrice: '' },
    mode: 'onChange',
    resolver: zodResolver(heroSearchSchema),
  })

  const onSubmit = (values: THeroSearchValues) => {
    const [fromCity, toCity] = values.routeKey.split('__')

    if (!fromCity || !toCity) return

    const minPriceNum =
      values.minPrice && !Number.isNaN(Number(values.minPrice))
        ? Number(values.minPrice)
        : undefined

    router.push(
      buildSearchUrl({
        page: 1,
        fromCity,
        toCity,
        startDate: values.startDate || undefined,
        minPrice: minPriceNum,
      })
    )
  }

  return (
    <LiquidGlassBlock className={styles.heroCard}>
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
            placeholder="Даты"
            controllerProps={{ control, name: 'startDate' }}
          />

          <MoneyField
            size="xl"
            placeholder="Оплата"
            controllerProps={{ control, name: 'minPrice' }}
          />
        </div>

        <Button type="submit" view="action" size="xl">
          <Text variant="header-1">Найти</Text>
        </Button>
      </form>
    </LiquidGlassBlock>
  )
}
