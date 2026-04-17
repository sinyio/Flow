import { HTMLAttributes } from 'react'

export const ClockIcon = ({ ...rest }: HTMLAttributes<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <g clipPath="url(#clip0_633_807)">
      <path
        d="M8.00001 4.00004V8.00004L10.6667 9.33337M14.6667 8.00004C14.6667 11.6819 11.6819 14.6667 8.00001 14.6667C4.31811 14.6667 1.33334 11.6819 1.33334 8.00004C1.33334 4.31814 4.31811 1.33337 8.00001 1.33337C11.6819 1.33337 14.6667 4.31814 14.6667 8.00004Z"
        stroke="black"
        strokeOpacity="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_633_807">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
)
