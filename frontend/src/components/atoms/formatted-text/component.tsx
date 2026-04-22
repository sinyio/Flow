'use client'

import { Text } from '@gravity-ui/uikit'
import type { TextProps } from '@gravity-ui/uikit'

import { normalizeContent } from '@utils/normalize-content'

interface FormattedTextProps {
  text: string
  variant?: TextProps['variant']
  className?: string
}

export const FormattedText = ({ text, variant = 'body-3', className }: FormattedTextProps) => {
  const paragraphs = (normalizeContent(text) ?? text).split('\n\n')

  return (
    <div className={className}>
      {paragraphs.map((para, i) => {
        const lines = para.split('\n')
        return (
          <Text
            key={i}
            variant={variant}
            as="p"
            style={{ margin: 0, marginBottom: i < paragraphs.length - 1 ? '1.4em' : 0 }}
          >
            {lines.map((line, j) => (
              <span key={j}>
                {line}
                {j < lines.length - 1 && <br />}
              </span>
            ))}
          </Text>
        )
      })}
    </div>
  )
}
