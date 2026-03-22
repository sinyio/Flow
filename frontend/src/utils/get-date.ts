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

export const getDate = (datetime?: string): string => {
  if (!datetime) {
    return 'неизвестная дата'
  }
  const parsedDate = new Date(datetime)
  const day = parsedDate.getDay()
  const month = parsedDate.toLocaleDateString('ru-RU', { month: 'long' })
  const year = parsedDate.getFullYear()

  return `с ${day} ${months[month]} ${year} года`
}
