export type TStatus = 'active' | 'finished'

export type TAd = {
  status: TStatus
  price: string
  route: string
  date: string
  imageUrl: string
}
