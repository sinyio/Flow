import { HTMLAttributes } from 'react'

export const DotsIcon = ({ ...rest }: HTMLAttributes<SVGSVGElement>) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      d="M7.99998 8.66669C8.36817 8.66669 8.66665 8.36821 8.66665 8.00002C8.66665 7.63183 8.36817 7.33335 7.99998 7.33335C7.63179 7.33335 7.33331 7.63183 7.33331 8.00002C7.33331 8.36821 7.63179 8.66669 7.99998 8.66669Z"
      stroke="black"
      strokeOpacity="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.99998 4.00002C8.36817 4.00002 8.66665 3.70154 8.66665 3.33335C8.66665 2.96516 8.36817 2.66669 7.99998 2.66669C7.63179 2.66669 7.33331 2.96516 7.33331 3.33335C7.33331 3.70154 7.63179 4.00002 7.99998 4.00002Z"
      stroke="black"
      strokeOpacity="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.99998 13.3334C8.36817 13.3334 8.66665 13.0349 8.66665 12.6667C8.66665 12.2985 8.36817 12 7.99998 12C7.63179 12 7.33331 12.2985 7.33331 12.6667C7.33331 13.0349 7.63179 13.3334 7.99998 13.3334Z"
      stroke="black"
      strokeOpacity="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
