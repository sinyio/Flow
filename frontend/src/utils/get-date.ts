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

export type TDateType = 'from' | 'before' | 'regular' | 'short'

export const getDate = (datetime?: string, dateType: TDateType = 'from'): string => {
  if (!datetime) {
    return 'неизвестная дата'
  }
  const parsedDate = new Date(datetime)
  const day = parsedDate.getDate()
  const month = parsedDate.toLocaleDateString('ru-RU', { month: 'long' })
  const year = String(parsedDate.getFullYear()).slice(-2)

  const date = {
    from: `с ${day} ${months[month]} ${year} года`,
    before: `до ${day} ${months[month]}`,
    regular: `${day} ${months[month]} ${parsedDate.getFullYear()} года`,
    short: `${String(day).padStart(2, '0')}.${String(parsedDate.getMonth() + 1).padStart(2, '0')}.${year}`,
  }

  return date[dateType]
}
