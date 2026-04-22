'use client'

import { Text } from '@gravity-ui/uikit'
import type { TextProps } from '@gravity-ui/uikit'

interface FormattedTextProps {
  text: string
  variant?: TextProps['variant']
  className?: string
}

export const FormattedText = ({ text, variant = 'body-3', className }: FormattedTextProps) => {
  const lines = text.split('\n')

  return (
    <div className={className}>
      {lines.map((line, i) =>
        line === '' ? (
          <div key={i} style={{ height: '0.6em' }} />
        ) : (
          <Text key={i} variant={variant} as="p" style={{ margin: 0 }}>
            {line}
          </Text>
        )
      )}
    </div>
  )
}
