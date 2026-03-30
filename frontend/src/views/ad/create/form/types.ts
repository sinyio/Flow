export type TCreateAdFormValues = {
  routeKey: string
  startDate: string
  endDate: string
  title: string
  role: 'sender' | 'recipient'
  isDocument: boolean
  isFragile: boolean
  packaging: string
  weight: string
  length: string
  width: string
  height: string
  price: string
  description: string
  image: File | null
}

