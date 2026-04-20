import { LabelProps } from '@gravity-ui/uikit'

import { TStatus } from '@api/ads'

export type TStatusMap = {
  title: string
  canEdit?: boolean
  theme?: LabelProps['theme']
}

export const statusesMap: Record<TStatus, TStatusMap> = {
  ACTIVE: {
    title: 'Активно',
    theme: 'success',
    canEdit: true,
  },
  FINISHED: {
    title: 'Завершено',
    canEdit: false,
  },
}
