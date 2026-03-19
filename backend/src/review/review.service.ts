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

  private mapReview(review: any) {
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

    await this.prisma.review.delete({ where: { id: reviewId } })

    return getStatusOk()
  }

  public async getReview(reviewId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: { author: true, target: true },
    })

    if (!review) throw new NotFoundException('Отзыв не найден')
    return this.mapReview(review)
  }

  public async getReviewsByTarget(userId: string, query: ReviewListQueryDto) {
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
      data: items.map((r) => this.mapReview(r)),
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

    return this.mapReview(updated)
  }
}
