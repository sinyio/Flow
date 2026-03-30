import { Label, LabelProps, Text, TextProps } from '@gravity-ui/uikit'

import styles from './component.module.css'

export interface IStatsProps {
  stats: string[]
  labelProps?: LabelProps
  textProps?: TextProps
}

export const Stats = ({ stats, labelProps, textProps }: IStatsProps) => (
  <div className={styles.container}>
    {stats.map((stat, index) => (
      <Label key={stat + index} {...labelProps}>
        <Text variant="body-2" {...textProps}>
          {stat}
        </Text>
      </Label>
    ))}
  </div>
)
