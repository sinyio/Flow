import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { AdStatus, ReviewType } from '@prisma/client'
import { PrismaService } from '@/src/prisma/prisma.service'
import { getUserResponse } from '@/src/user/dto'
import { ReviewCreateDto, ReviewListQueryDto, ReviewTargetRole, ReviewUpdateDto } from './dto'
import { getStatusOk } from '@/src/common/helpers'
import { type Request } from 'express'

@Injectable()
export class ReviewService {
  public constructor(private readonly prisma: PrismaService) {}

  private async refreshAggregateRatingsForUser(targetId: string): Promise<void> {
    const [asCourier, asCustomer] = await Promise.all([
      this.prisma.review.aggregate({
        where: { targetId, type: ReviewType.CUSTOMER_TO_COURIER },
        _avg: { rating: true },
      }),
      this.prisma.review.aggregate({
        where: { targetId, type: ReviewType.COURIER_TO_CUSTOMER },
        _avg: { rating: true },
      }),
    ])

    const toStored = (avg: number | null) =>
      avg == null ? 0 : Math.min(5, Math.max(0, Math.round(avg * 100) / 100))

    await this.prisma.user.update({
      where: { id: targetId },
      data: {
        courierRating: toStored(asCourier._avg.rating),
        customerRating: toStored(asCustomer._avg.rating),
      },
    })
  }

  private mapReview(review: any, userId: string) {
    return {
      id: review.id,
      adId: review.adId,
      rating: review.rating,
      text: review.text,
      type: review.type,
      isAnonymous: review.isAnonymous,
      createdAt: review.createdAt,
      author: review.isAnonymous ? null : getUserResponse(review.author),
      target: getUserResponse(review.target),
      userState: {
        canEdit: review.authorId === userId,
      }
    }
  }

  public async putReview(req: Request, dto: ReviewCreateDto) {
    const authorId = req.session.userId

    const ad = await this.prisma.ad.findUnique({
      where: { id: dto.adId },
      select: { authorId: true, courierId: true, status: true },
    })

    if (!ad) throw new NotFoundException('Объявление не найдено')
    if (ad.status === AdStatus.ACTIVE) throw new BadRequestException('Объявление еще не завершено')

    let targetId: string
    let type: ReviewType

    if (ad.authorId === authorId) {
      if (!ad.courierId) {
        throw new BadRequestException('Для этого объявления ещё не назначен курьер')
      }
      targetId = ad.courierId
      type = ReviewType.CUSTOMER_TO_COURIER
    } else if (ad.courierId && ad.courierId === authorId) {
      targetId = ad.authorId
      type = ReviewType.COURIER_TO_CUSTOMER
    } else {
      throw new BadRequestException('Вы не можете оставить отзыв к этому объявлению')
    }

    if (targetId === authorId) throw new BadRequestException('Нельзя оставить отзыв самому себе')

    const existing = await this.prisma.review.findFirst({
      where: {
        adId: dto.adId,
        authorId,
        targetId,
        type,
      },
      select: { id: true },
    })

    if (existing) {
      throw new BadRequestException('Отзыв уже существует. Для изменения используйте PATCH')
    }

    await this.prisma.review.create({
      data: {
        adId: dto.adId,
        authorId: authorId!,
        targetId,
        rating: dto.rating,
        isAnonymous: dto.isAnonymous,
        text: dto.text ?? null,
        type,
      },
      include: { author: true, target: true },
    })

    await this.refreshAggregateRatingsForUser(targetId)

    return getStatusOk()
  }

  public async deleteReview(req: Request, reviewId: string) {
    const userId = req.session.userId

    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: { author: true, target: true },
    })

    if (!review) throw new NotFoundException('Отзыв не найден')
    if (review.authorId !== userId) throw new ForbiddenException('Удалить может только автор отзыва')

    const { targetId } = review

    await this.prisma.review.delete({ where: { id: reviewId } })

    await this.refreshAggregateRatingsForUser(targetId)

    return getStatusOk()
  }

  public async getReview(req: Request, reviewId: string) {
    const userId = req.session.userId
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: { author: true, target: true },
    })

    if (!review) throw new NotFoundException('Отзыв не найден')
    return this.mapReview(review, userId!)
  }

  public async getReviewsByTarget(req: Request, userId: string, query: ReviewListQueryDto) {
    const myUserId = req.session.userId
    const { page = 1, limit = 10, role = ReviewTargetRole.ALL } = query
    const skip = (page - 1) * limit

    const where: any = {
      targetId: userId,
    }

    if (role === ReviewTargetRole.COURIER) {
      where.type = ReviewType.CUSTOMER_TO_COURIER
    } else if (role === ReviewTargetRole.CUSTOMER) {
      where.type = ReviewType.COURIER_TO_CUSTOMER
    } else {
      where.type = { in: [ReviewType.CUSTOMER_TO_COURIER, ReviewType.COURIER_TO_CUSTOMER] }
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.review.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { author: true, target: true },
      }),
      this.prisma.review.count({ where }),
    ])

    return {
      data: items.map((r) => this.mapReview(r, myUserId!)),
      meta: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  }

  public async patchReview(req: Request, reviewId: string, dto: ReviewUpdateDto) {
    const userId = req.session.userId

    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: { author: true, target: true },
    })

    if (!review) throw new NotFoundException('Отзыв не найден')
    if (review.authorId !== userId) throw new ForbiddenException('Удалить может только автор отзыва')

    const updated = await this.prisma.review.update({
      where: { id: reviewId },
      data: {
        rating: dto.rating,
        text: dto.text ?? null,
      },
      include: { author: true, target: true },
    })

    await this.refreshAggregateRatingsForUser(updated.targetId)

    return this.mapReview(updated, userId)
  }
}
