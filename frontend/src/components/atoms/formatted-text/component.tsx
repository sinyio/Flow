'use client'

import { Text } from '@gravity-ui/uikit'
import type { TextProps } from '@gravity-ui/uikit'

interface FormattedTextProps {
  text: string
  variant?: TextProps['variant']
  className?: string
}

const normalizeText = (text: string) =>
  text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n{3,}/g, '\n\n')

export const FormattedText = ({ text, variant = 'body-3', className }: FormattedTextProps) => {
  const paragraphs = normalizeText(text).split('\n\n')

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
