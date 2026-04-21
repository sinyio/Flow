'use client'

import { useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button, DropdownMenu, Text, TextInput } from '@gravity-ui/uikit'
import { Sliders } from '@gravity-ui/icons'

import { TMediaPostSort } from '@api/media'

import styles from './component.module.css'

const SORT_OPTIONS: { value: TMediaPostSort; label: string }[] = [
  { value: 'relevant', label: 'По релевантности' },
  { value: 'newest', label: 'Сначала новые' },
  { value: 'oldest', label: 'Сначала старые' },
]

export const MediaSearch = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [popupOpen, setPopupOpen] = useState(false)
  const filterRef = useRef<HTMLButtonElement>(null)

  const currentSort = searchParams.get('sort') as TMediaPostSort | null

  const updateParams = (updates: Record<string, string>) => {
    const url = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([k, v]) => (v ? url.set(k, v) : url.delete(k)))
    router.push(`?${url.toString()}`)
  }

  return (
    <div className={styles.heroCard}>
      <div className={styles.heroInner}>
        <TextInput
          placeholder="Поиск"
          size="xl"
          className={styles.searchInput}
          defaultValue={searchParams.get('search') ?? ''}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              updateParams({ search: (e.target as HTMLInputElement).value })
            }
          }}
        />
        <DropdownMenu
          size="l"
          popupProps={{
            placement: 'bottom-end',
            offset: 8,
          }}
          renderSwitcher={props => (
            <Button {...props} view="flat" size="xl" selected={popupOpen}>
              <Sliders />
            </Button>
          )}
          items={SORT_OPTIONS.map(option => ({
            text: option.label,
            action: () => {
              updateParams({ sort: currentSort === option.value ? '' : option.value })
            },
            ...(currentSort === option.value && { iconStart: <span>✓</span> }),
          }))}
        />
      </div>
    </div>
  )
}
