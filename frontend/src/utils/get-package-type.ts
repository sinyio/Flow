import { TPackaging } from '@api/ads'

export const getPackageType = (packageType: TPackaging) => {
  const packages: Record<TPackaging, string> = {
    BOX: 'Коробка',
    ENVELOPE: 'Конверт',
    FILM: 'Пакет',
    NO_PACKAGING: 'Без упаковки',
    PACKAGE: 'Упаковка',
    OTHER: 'Другая',
  }

  return packages[packageType]
}
