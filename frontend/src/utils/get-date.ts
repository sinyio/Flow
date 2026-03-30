const months: Record<string, string> = {
  январь: 'января',
  февраль: 'февраля',
  март: 'марта',
  апрель: 'апреля',
  май: 'мая',
  июнь: 'июня',
  июль: 'июля',
  август: 'августа',
  сентябрь: 'сентября',
  октябрь: 'октября',
  ноябрь: 'ноября',
  декабрь: 'декабря',
}

export type TDateType = 'from' | 'before'

export const getDate = (datetime?: string, dateType: TDateType = 'from'): string => {
  if (!datetime) {
    return 'неизвестная дата'
  }
  const parsedDate = new Date(datetime)
  const day = parsedDate.getDate()
  const month = parsedDate.toLocaleDateString('ru-RU', { month: 'long' })
  const year = parsedDate.getFullYear()

  const date = {
    from: `с ${day} ${months[month]} ${year} года`,
    before: `до ${day} ${months[month]}`,
  }

  return date[dateType]
}
