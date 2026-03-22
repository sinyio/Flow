import { LabelProps } from '@gravity-ui/uikit'

export type TStatus = 'active' | 'finished'

export type TAd = {
  status: TStatus
  price: string
  route: string
  date: string
  imageUrl: string
}

export type TStatusMap = {
  title: string
  canEdit?: boolean
  theme?: LabelProps['theme']
}

export const statusesMap: Record<TStatus, TStatusMap> = {
  active: {
    title: 'Активно',
    theme: 'success',
    canEdit: true,
  },
  finished: {
    title: 'Завершено',
    canEdit: false,
  },
}
