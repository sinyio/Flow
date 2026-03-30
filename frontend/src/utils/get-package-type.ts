import { TPackageType } from '@entities/ad'

export const getPackageType = (packageType: TPackageType) => {
  const packages: Record<TPackageType, string> = {
    BOX: 'Коробка',
    ENVELOPE: 'Конверт',
    FILM: 'Пакет',
    NO_PACKAGING: 'Без упаковки',
    PACKAGE: 'Упаковка',
    OTHER: 'Другая',
  }

  return packages[packageType]
}
