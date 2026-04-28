import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { AdFilterDto, AdDto, getAdResponse, AdUpdateDto } from './dto'
import { PaginatedResponse } from '../common/types'
import { filterEmptyValues, getBoolFromString, getStatusOk } from '../common/helpers'
import { type Request } from 'express'
import { nanoid } from 'nanoid'
import { v4 as uuidv4 } from 'uuid'
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
    const userId = req.session.userId

    const [ad, existingResponse] = await Promise.all([
      this.prisma.ad.findUnique({
        where: { id },
        include: {
          author: true,
          sender: true,
          recipient: true,
          courier: true,
          _count: { select: { responses: true } },
        },
      }),
      userId
        ? this.prisma.adResponse.findUnique({
            where: { adId_courierId: { adId: id, courierId: userId } },
            include: { chat: true },
          })
        : null,
    ])

    if (!ad || ad.deletedAt) throw new NotFoundException('Объявление не найдено')

    return getAdResponse(ad, userId!, !!existingResponse, existingResponse?.chat?.id ?? null)
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

    const where: any = { deletedAt: null }

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

    const where = { authorId: userId, deletedAt: null }

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

      const thumb600 = await sharp(originalBuffer)
        .resize(600, 600, { fit: 'cover' })
        .jpeg({ quality: 85 })
        .toBuffer()

      await this.s3.upload(
        this.configService.getOrThrow('MINIO_BUCKET'),
        imageKey,
        thumb600,
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

    return { ...getStatusOk(), id: adId }
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

      const thumb600 = await sharp(originalBuffer)
        .resize(600, 600, { fit: 'cover' })
        .jpeg({ quality: 85 })
        .toBuffer()

      await this.s3.upload(
        this.configService.getOrThrow('MINIO_BUCKET'),
        imageKey,
        thumb600,
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

    await this.prisma.ad.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        senderId: null,
        recipientId: null,
        courierId: null,
        image: null,
        title: null,
        description: null,
        price: null,
        weight: null,
        isFragile: false,
        isDocument: false,
        packaging: null,
        length: null,
        width: null,
        height: null,
        startDate: null,
        endDate: null,
        fromCity: null,
        toCity: null,
        status: 'COMPLETED',
        createdAt: new Date(),
        updatedAt: new Date(),
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
            toCity: route.toCity,
            deletedAt: null,
          },
          include: { author: true, sender: true, recipient: true, courier: true },
          orderBy: { createdAt: 'desc' },
          take: 3
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

    const { chatId } = await this.prisma.$transaction(async (tx) => {
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

      const messageCount = await tx.message.count({ where: { chatId: chat.id } })
      if (messageCount === 0) {
        await tx.message.create({
          data: {
            chatId: chat.id,
            senderId: userId,
            text: 'Отклик на объявление',
            type: 'AD_RESPONSE',
          },
        })
      }

      return { chatId: chat.id }
    })

    return { ...getStatusOk(), chatId }
  }

  async completeAd(req: Request, id: string) {
    const userId = req.session.userId
    if (!userId) throw new UnauthorizedException('Сессия не найдена')

    const ad = await this.prisma.ad.findUnique({ where: { id } })
    if (!ad) throw new NotFoundException('Объявление не найдено')
    if (ad.status === 'COMPLETED') throw new BadRequestException('Объявление уже завершено')

    await this.prisma.$transaction([
      this.prisma.ad.update({
        where: { id },
        data: { status: 'COMPLETED' },
      }),
      this.prisma.adResponse.updateMany({
        where: { adId: id, status: 'PENDING' },
        data: { status: 'CANCELED' },
      }),
    ])

    return getStatusOk()
  }

  public async removeCourier(req: Request, adId: string) {
    const userId = req.session.userId
    if (!userId) throw new UnauthorizedException('Сессия не найдена')

    const ad = await this.prisma.ad.findUnique({ where: { id: adId } })
    if (!ad) throw new NotFoundException('Объявление не найдено')
    if (ad.authorId !== userId) throw new ForbiddenException('Только автор может снять исполнителя')
    if (!ad.courierId) throw new BadRequestException('Исполнитель не назначен')

    await this.prisma.$transaction(async (tx) => {
      await tx.ad.update({ where: { id: adId }, data: { courierId: null, recipientId: null } })
      await tx.adResponse.updateMany({
        where: { adId, status: 'ACCEPTED' },
        data: { status: 'REJECTED' },
      })
      await tx.token.deleteMany({ where: { email: adId, type: 'RECIPIENT_INVITE' as any } })
    })

    return getStatusOk()
  }

  public async removeRecipient(req: Request, adId: string) {
    const userId = req.session.userId
    if (!userId) throw new UnauthorizedException('Сессия не найдена')

    const ad = await this.prisma.ad.findUnique({ where: { id: adId } })
    if (!ad) throw new NotFoundException('Объявление не найдено')
    if (ad.authorId !== userId) throw new ForbiddenException('Только автор может снять получателя')
    if (!ad.recipientId) throw new BadRequestException('Получатель не назначен')

    await this.prisma.ad.update({ where: { id: adId }, data: { recipientId: null } })

    return getStatusOk()
  }

  public async generateRecipientInvite(req: Request, adId: string) {
    const userId = req.session.userId
    if (!userId) throw new UnauthorizedException('Сессия не найдена')

    const ad = await this.prisma.ad.findUnique({ where: { id: adId } })
    if (!ad) throw new NotFoundException('Объявление не найдено')
    if (ad.authorId !== userId) throw new ForbiddenException('Только автор может создать приглашение')

    await this.prisma.token.deleteMany({
      where: { email: adId, type: 'RECIPIENT_INVITE' as any },
    })

    const token = uuidv4()
    await this.prisma.token.create({
      data: {
        email: adId,
        token,
        type: 'RECIPIENT_INVITE' as any,
        expiresIn: new Date(Date.now() + 48 * 3600 * 1000),
      },
    })

    return { token }
  }

  public async acceptRecipientInvite(req: Request, token: string) {
    const userId = req.session.userId
    if (!userId) throw new UnauthorizedException('Сессия не найдена')

    const existingToken = await this.prisma.token.findFirst({
      where: { token, type: 'RECIPIENT_INVITE' as any },
    })

    if (!existingToken) throw new NotFoundException('Приглашение не найдено')
    if (new Date(existingToken.expiresIn) < new Date()) throw new BadRequestException('Срок приглашения истёк')

    const adId = existingToken.email

    const ad = await this.prisma.ad.findUnique({ where: { id: adId } })
    if (!ad) throw new NotFoundException('Объявление не найдено')
    if (ad.authorId === userId) throw new BadRequestException('Автор не может быть получателем')
    if (ad.courierId === userId) throw new BadRequestException('Исполнитель не может быть получателем')
    if (ad.recipientId) throw new BadRequestException('Получатель уже назначен')

    await this.prisma.$transaction(async (tx) => {
      await tx.ad.update({ where: { id: adId }, data: { recipientId: userId } })
      await tx.token.delete({ where: { id: existingToken.id } })
    })

    return { ...getStatusOk(), adId }
  }

  public async assignCourier(req: Request, adId: string, courierId: string) {
    const userId = req.session.userId
    if (!userId) throw new UnauthorizedException('Сессия не найдена')

    const ad = await this.prisma.ad.findUnique({
      where: { id: adId },
      include: { responses: true },
    })

    if (!ad) throw new NotFoundException('Объявление не найдено')
    if (ad.authorId !== userId) throw new ForbiddenException('Только автор объявления может назначить исполнителя')
    if (courierId === ad.authorId) throw new BadRequestException('Нельзя назначить автора объявления курьером')

    const hasResponse = ad.responses.some((r) => r.courierId === courierId)
    if (!hasResponse) throw new BadRequestException('Этот пользователь не откликался на объявление')

    await this.prisma.$transaction(async (tx) => {
      await tx.ad.update({
        where: { id: adId },
        data: { courierId },
      })
      await tx.adResponse.updateMany({
        where: { adId, courierId: { not: courierId } },
        data: { status: 'REJECTED' },
      })
      await tx.adResponse.update({
        where: { adId_courierId: { adId, courierId } },
        data: { status: 'ACCEPTED' },
      })
    })

    return getStatusOk()
  }
}
