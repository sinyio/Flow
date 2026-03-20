import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { hash } from 'argon2'
import { type Request } from 'express'

@Injectable()
export class UserService {
  public constructor(private readonly prismaService: PrismaService) { }

  public async findById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    })

    if (!user) {
      throw new NotFoundException('Пользователь не найден')
    }

    return user
  }

  public async findByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    })

    return user
  }

  public async create(email: string, password: string) {
    const user = await this.prismaService.user.create({
      data: {
        email,
        password: await hash(password),
      },
    })

    return user
  }

  public async getProfile(req: Request, id: string) {
    const userId = req.session.userId
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        photo: true,
        // phoneNumber: true,
        // email: true,
        // isVerified: true,
        // role: true,
        createdAt: true,
        // updatedAt: true,
        _count: {
          select: {
            deliveredAds: {
              where: {
                status: 'COMPLETED',
              },
            },
            authoredAds: true,
            reviewsReceived: true,
            reviewsAuthored: true,
          },
        },
      },
    })

    if (!user) {
      throw new NotFoundException('Пользователь не найден')
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      photo: user.photo,
      // phoneNumber: user.phoneNumber,
      // email: user.email,
      // isVerified: user.isVerified,
      // role: user.role,
      registeredAt: user.createdAt,
      // updatedAt: user.updatedAt,
      successfulDeliveriesCount: user._count.deliveredAds,
      authoredAdsCount: user._count.authoredAds,
      receivedReviewsCount: user._count.reviewsReceived,
      authoredReviewsCount: user._count.reviewsAuthored,
      userState: {
        canEdit: userId === id
      }
    }
  }
}
