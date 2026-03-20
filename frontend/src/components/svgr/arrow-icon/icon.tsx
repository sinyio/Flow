'use no memo'
import { HTMLAttributes } from 'react'

export const ArrowIcon = ({ ...rest }: HTMLAttributes<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      d="M13.3333 8H2.66666M2.66666 8L6.66666 12M2.66666 8L6.66666 4"
      stroke="black"
      strokeOpacity="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
