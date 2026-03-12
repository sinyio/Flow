import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { getAdResponse } from './dto/ad.dto'
import { AdFilterDto } from './dto'
import { PaginatedResponse } from '../common/types'

@Injectable()
export class AdService {
  constructor(private readonly prisma: PrismaService) { }

  public async findAdById(id: string) {
    const ad = await this.prisma.ad.findUnique({
      where: { id },
      include: { user: true },
    })

    if (!ad) throw new NotFoundException('Объявление не найдено')

    return getAdResponse(ad)
  }

  public async findAll(
    filters: AdFilterDto,
  ): Promise<PaginatedResponse<ReturnType<typeof getAdResponse>>> {
    const {
      page = 1,
      limit = 10,
      minPrice,
      startDate,
      endDate,
      fromCity,
      toCity
    } = filters

    const where: any = {}

    if (minPrice) {
      where.price = {}

      if (minPrice) where.price.gte = minPrice
    }

    if (startDate && endDate) {
      where.AND = [
        { startDate: { lte: new Date(endDate) } },
        { endDate: { gte: new Date(startDate) } }
      ]
    }

    if (fromCity) where.fromCity = fromCity
    if (toCity) where.toCity = toCity

    const [ads, total] = await this.prisma.$transaction([
      this.prisma.ad.findMany({
        where,
        include: { user: true },
        skip: (page - 1) * limit,
        take: limit
      }),
      this.prisma.ad.count({ where })
    ])

    const data = ads.map(getAdResponse)

    return {
      data,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  }
}
