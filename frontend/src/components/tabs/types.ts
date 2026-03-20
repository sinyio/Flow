import { ReactNode } from 'react'

export type TTabProps = {
  label: string
  value: string
  counter?: number
  content: ReactNode
}

export interface TabsProps {
  tabs: TTabProps[]
}
