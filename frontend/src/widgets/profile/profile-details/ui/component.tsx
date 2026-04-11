import { Accordion, Text } from '@gravity-ui/uikit'
import { ReactNode } from 'react'

import styles from './component.module.css'

export type TProfileDetailLine = {
  label: string
  value: string
  icon: ReactNode
}

interface IProfileDetailsProps {
  lines: TProfileDetailLine[]
}

export const ProfileDetails = ({ lines }: IProfileDetailsProps) => (
  <Accordion view="top-bottom" size="l" arrowPosition="end" className={styles.container}>
    <Accordion.Item
      defaultExpanded
      summary={<Text variant="subheader-3">Подробнее</Text>}
      value="details"
    >
      <div className={styles.lines}>
        {lines.map(line => (
          <Text variant="body-2" key={`${line.label}-${line.value}`} className={styles.line}>
            {line.icon}
            <p>
              <span className={styles.muted}>{line.label}</span>{' '}
              <span className={styles.value}>{line.value}</span>
            </p>
          </Text>
        ))}
      </div>
    </Accordion.Item>
  </Accordion>
)
