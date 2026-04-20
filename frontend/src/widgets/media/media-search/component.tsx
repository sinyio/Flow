'use client'

import { useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button, Popup, Text, TextInput } from '@gravity-ui/uikit'
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
        <Button
          ref={filterRef}
          view="flat"
          size="xl"
          selected={popupOpen}
          onClick={() => setPopupOpen(v => !v)}
        >
          <Sliders />
        </Button>
        <Popup
          open={popupOpen}
          anchorRef={filterRef}
          onOutsideClick={() => setPopupOpen(false)}
          placement="bottom-end"
        >
          <div className={styles.popupContent}>
            {SORT_OPTIONS.map(option => (
              <button
                key={option.value}
                className={`${styles.sortOption} ${currentSort === option.value ? styles.sortOptionActive : ''}`}
                onClick={() => {
                  updateParams({ sort: currentSort === option.value ? '' : option.value })
                  setPopupOpen(false)
                }}
              >
                <Text variant="body-2">{option.label}</Text>
              </button>
            ))}
          </div>
        </Popup>
      </div>
    </div>
  )
}
