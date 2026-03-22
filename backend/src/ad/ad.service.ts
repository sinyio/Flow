import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AdFilterDto, AdDto, getAdResponse, AdUpdateDto } from './dto'
import { PaginatedResponse } from '../common/types'
import { filterEmptyValues, getBoolFromString, getStatusOk } from '../common/helpers'
import { type Request } from 'express'
import { nanoid } from 'nanoid'
import { S3Service } from '../s3/s3.service'
import { ConfigService } from '@nestjs/config'
import sharp from 'sharp'


@Injectable()
export class AdService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3: S3Service,
    private readonly configService: ConfigService
  ) { }

  public async findAdById(req: Request, id: string) {
    const ad = await this.prisma.ad.findUnique({
      where: { id },
      include: { author: true, sender: true, recipient: true, courier: true },
    })

    const userId = req.session.userId

    if (!ad) throw new NotFoundException('Объявление не найдено')

    return getAdResponse(ad, userId!)
  }

  public async findAll(
    req: Request,
    filters: AdFilterDto,
  ): Promise<PaginatedResponse<ReturnType<typeof getAdResponse>>> {
    const {
      page = 1,
      limit = 10,
      minPrice,
      maxWeight,
      startDate,
      endDate,
      fromCity,
      toCity,
      isFragile,
      isDocument
    } = filters

    const where: any = {}

    if (minPrice) {
      where.price = {
        gte: minPrice
      }
    }

    if (maxWeight) {
      where.weight = {
        lte: maxWeight
      }
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
        include: { author: true, sender: true, recipient: true, courier: true },
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

  public async findAdsByAuthorId(
    req: Request,
    userId: string,
    page = 1,
    limit = 10,
  ): Promise<PaginatedResponse<ReturnType<typeof getAdResponse>>> {
    const skip = (page - 1) * limit

    const where = { authorId: userId }

    const [ads, total] = await this.prisma.$transaction([
      this.prisma.ad.findMany({
        where,
        include: { author: true, sender: true, recipient: true, courier: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.ad.count({ where }),
    ])

    const sessionUserId = req.session.userId

    const data = ads.map((ad) => getAdResponse(ad, sessionUserId))

    return {
      data,
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  }

  public async create(req: Request, ad: AdDto, file) {
    const { role, ...data } = ad

    const authorId = req.session.userId

    let senderId, recipientId
    if (role === 'sender') senderId = authorId
    if (role === 'recipient') recipientId = authorId

    const adId = nanoid(12)

    let imageKey: string | undefined
    if (file) {
      const originalBuffer = file.buffer
      imageKey = `ads/${adId}/image`

      const thumb250 = await sharp(originalBuffer)
        .resize(250, 250, { fit: 'cover' })
        .jpeg({ quality: 85 })
        .toBuffer()

      await this.s3.upload(
        this.configService.getOrThrow('MINIO_BUCKET'),
        imageKey,
        thumb250,
        'image/jpeg'
      )
    }

    const imagePath = `${this.configService.getOrThrow('MINIO_PUBLIC_BASE')}/${this.configService.getOrThrow('MINIO_BUCKET')}/${imageKey}`

    await this.prisma.ad.create({
      data: {
        id: adId,
        ...data,
        authorId: authorId!,
        senderId,
        recipientId,
        image: imagePath
      }
    })

    return getStatusOk()
  }

  public async update(req: Request, id: string, ad: AdUpdateDto, file?) {
    const { role, ...data } =  filterEmptyValues(ad)

    const authorId = req.session.userId

    let senderId, recipientId
    if (role === 'sender') senderId = authorId
    if (role === 'recipient') recipientId = authorId

    if (file) {
      const adId = id
      const originalBuffer = file.buffer
      const imageKey = `ads/${adId}/image`

      const thumb250 = await sharp(originalBuffer)
        .resize(250, 250, { fit: 'cover' })
        .jpeg({ quality: 85 })
        .toBuffer()

      await this.s3.upload(
        this.configService.getOrThrow('MINIO_BUCKET'),
        imageKey,
        thumb250,
        'image/jpeg'
      )
    }

    await this.prisma.ad.update({
      where: {
        id
      },
      data: {
        ...data,
        authorId,
        senderId,
        recipientId,
      }
    })

    return getStatusOk()
  }

  public async delete(id: string) {
    if (!id || Array.isArray(id)) throw new BadRequestException('Invalid ID');

    await this.prisma.ad.delete({
      where: {
        id
      }
    })

    return getStatusOk()
  }

  async getPopularRoutes(req: Request) {
    const routes = await this.prisma.ad.groupBy({
      by: ['fromCity', 'toCity'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 2
    })

    const userId = req.session.userId
    if (!userId) throw new UnauthorizedException('Сессия не найдена')

    return Promise.all(
      routes.map(async (route) => {
        const ads = await this.prisma.ad.findMany({
          where: {
            fromCity: route.fromCity,
            toCity: route.toCity
          },
          include: { author: true, sender: true, recipient: true, courier: true },
          orderBy: { createdAt: 'desc' },
          take: 2
        })

        return {
          fromCity: route.fromCity,
          toCity: route.toCity,
          totalAds: route._count.id,
          latestAds: ads.map(ad => getAdResponse(ad, userId))
        }
      })
    )
  }

  async respondToAd(req: Request, id: string) {
    const userId = req.session.userId

    if (!userId) throw new UnauthorizedException('Сессия не найдена')

    const ad = await this.prisma.ad.findUnique({
      where: { id }
    })

    if (!ad) throw new NotFoundException('Объявление не найдено')

    if (ad.authorId === userId) throw new BadRequestException('Вы не можете ответить на свое объявление')

    await this.prisma.$transaction(async (tx) => {
      const response = await tx.adResponse.upsert({
        where: {
          adId_courierId: {
            adId: id,
            courierId: userId,
          },
        },
        update: {},
        create: {
          adId: id,
          courierId: userId,
        },
      })

      const chat = await tx.chat.upsert({
        where: {
          responseId: response.id,
        },
        update: {},
        create: {
          adId: id,
          responseId: response.id,
        },
      })

      await tx.chatMember.createMany({
        data: [
          { chatId: chat.id, userId: ad.authorId, role: 'CUSTOMER' },
          { chatId: chat.id, userId, role: 'COURIER' },
        ],
        skipDuplicates: true,
      })
    })

    return getStatusOk()
  }
}
