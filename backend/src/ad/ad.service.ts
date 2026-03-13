import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AdFilterDto, AdDto, getAdResponse } from './dto'
import { PaginatedResponse } from '../common/types'
import { getBoolFromString, getStatusOk } from '../common/helpers'
import { type Request } from 'express'


@Injectable()
export class AdService {
  constructor(private readonly prisma: PrismaService) { }

  public async findAdById(req: Request, id: string) {
    const ad = await this.prisma.ad.findUnique({
      where: { id },
      include: { author: true, sender: true, recipient: true },
    })

    const userId = req.session.userId

    if (!ad) throw new NotFoundException('Объявление не найдено')

    return getAdResponse(ad, userId)
  }

  public async findAll(
    req: Request,
    filters: AdFilterDto,
  ): Promise<PaginatedResponse<ReturnType<typeof getAdResponse>>> {
    const {
      page = 1,
      limit = 10,
      minPrice,
      startDate,
      endDate,
      fromCity,
      toCity,
      isFragile,
      isDocument
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

    if (isFragile) where.isFragile = getBoolFromString(isFragile as any)
    if (isDocument) where.isDocument = getBoolFromString(isDocument as any)

    const [ads, total] = await this.prisma.$transaction([
      this.prisma.ad.findMany({
        where,
        include: { author: true, sender: true, recipient: true },
        skip: (page - 1) * limit,
        take: limit
      }),
      this.prisma.ad.count({ where })
    ])

    const userId = req.session.userId

    const data = ads.map(ad => getAdResponse(ad, userId))

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

  public async create(req: Request, ad: AdDto) {
    const { role, ...data } = ad

    const authorId = req.session.userId

    if (!authorId) throw new UnauthorizedException('Сессия не найдена')

    let senderId
    if (role === 'sender') senderId = authorId

    let recipientId
    if (role === 'recipient') recipientId = authorId

    await this.prisma.ad.create({
      data: {
        ...data,
        authorId,
        senderId,
        recipientId
      }
    })

    return getStatusOk()
  }

  public async update(req: Request, id: string, ad: AdDto) {
    const { role, ...data } = ad

    const authorId = req.session.userId
    if (!authorId) throw new UnauthorizedException('Сессия не найдена')

    if (!id || Array.isArray(id)) throw new BadRequestException('Invalid ID');

    let senderId
    if (role === 'sender') senderId = authorId

    let recipientId
    if (role === 'recipient') recipientId = authorId

    await this.prisma.ad.update({
      where: {
        id
      },
      data: {
        ...data,
        authorId,
        senderId,
        recipientId
      }
    })

    return getStatusOk()
  }
}
