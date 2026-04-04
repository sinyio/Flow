'use no memo'
import { HTMLAttributes } from 'react'

export const StarFilledIcon = ({ color, ...rest }: HTMLAttributes<SVGSVGElement>) => (
  <svg
    width="12"
    height="11"
    viewBox="0 0 12 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      d="M5.70633 0L7.46969 3.57295L11.4127 4.1459L8.5595 6.92705L9.23304 10.8541L5.70633 9L2.17962 10.8541L2.85316 6.92705L-9.53674e-06 4.1459L3.94297 3.57295L5.70633 0Z"
      fill={color}
    />
  </svg>
)
