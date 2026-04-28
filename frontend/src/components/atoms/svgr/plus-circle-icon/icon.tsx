import { HTMLAttributes } from 'react'

export const PlusCircleIcon = ({ ...rest }: HTMLAttributes<SVGSVGElement>) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      d="M9.99935 6.6665V13.3332M6.66602 9.99984H13.3327M18.3327 9.99984C18.3327 14.6022 14.6017 18.3332 9.99935 18.3332C5.39698 18.3332 1.66602 14.6022 1.66602 9.99984C1.66602 5.39746 5.39698 1.6665 9.99935 1.6665C14.6017 1.6665 18.3327 5.39746 18.3327 9.99984Z"
      stroke="black"
      strokeOpacity="0.85"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
