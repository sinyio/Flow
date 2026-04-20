'use client'

import { useState } from 'react'

import { StarFilledIcon } from '@components/atoms/svgr/star-filled-icon/icon'
import { StarIcon } from '@components/atoms/svgr/star-icon/icon'

import styles from './component.module.css'

export interface IRatingSelectorProps {
  value: number
  onChange: (rating: number) => void
  disabled?: boolean
}

export const RatingSelector = ({ value, onChange, disabled = false }: IRatingSelectorProps) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null)

  const displayValue = hoverValue !== null ? hoverValue : value

  return (
    <div className={styles.container}>
      {[1, 2, 3, 4, 5].map(rating => {
        const isFilled = rating <= displayValue

        return (
          <button
            key={rating}
            type="button"
            className={styles.star}
            onClick={() => !disabled && onChange(rating)}
            onMouseEnter={() => !disabled && setHoverValue(rating)}
            onMouseLeave={() => !disabled && setHoverValue(null)}
            disabled={disabled}
            aria-label={`Оценка ${rating} из 5`}
          >
            {isFilled ? (
              <StarFilledIcon className={styles.starFilled} />
            ) : (
              <StarIcon className={styles.starEmpty} />
            )}
          </button>
        )
      })}
    </div>
  )
}
