import type { MaskitoOptions } from '@maskito/core'

const RUBLE_SYMBOL = '₽'

export const moneyMask = {
  mask: ({ value }) => {
    const digitsMask = Array.from(value.replaceAll(RUBLE_SYMBOL, '')).map(() => /\d/)

    if (!digitsMask.length) {
      return [/\d/]
    }

    return [...digitsMask, RUBLE_SYMBOL]
  },
} satisfies MaskitoOptions
