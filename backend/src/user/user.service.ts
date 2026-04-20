import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { hash } from 'argon2'
import { type Request } from 'express'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { ConfigService } from '@nestjs/config'
import { S3Service } from '../s3/s3.service'
import sharp from 'sharp'
import { filterEmptyValues, getStatusOk } from '../common/helpers'
import { nanoid } from 'nanoid'

@Injectable()
export class UserService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly s3: S3Service,
    private readonly configService: ConfigService
  ) { }

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
    const userId = nanoid(12)

    const user = await this.prismaService.user.create({
      data: {
        id: userId,
        email,
        password: await hash(password),
        photo: `${this.configService.getOrThrow('MINIO_PUBLIC_BASE')}/${this.configService.getOrThrow('MINIO_BUCKET')}/users/default/avatar.svg`,
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
        gender: true,
        dateOfBirth: true,
        contacts: true,
        courierRating: true,
        customerRating: true,
        createdAt: true,
        deletedAt: true,
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
      gender: user.gender,
      dateOfBirth: user.dateOfBirth,
      contacts: user.contacts,
      registeredAt: user.createdAt,
      deletedAt: user.deletedAt,
      // updatedAt: user.updatedAt,
      successfulDeliveriesCount: user._count.deliveredAds,
      authoredAdsCount: user._count.authoredAds,
      receivedReviewsCount: user._count.reviewsReceived,
      authoredReviewsCount: user._count.reviewsAuthored,
      courierRating: user.courierRating,
      customerRating: user.customerRating,
      userState: {
        canEdit: userId === id
      }
    }
  }

  public async updateProfile(req: Request, dto: UpdateProfileDto, file) {
    console.log(dto)
    console.log(file)
    const userId = req.session.userId

    const data = filterEmptyValues(dto)

    let imageKey: string | undefined
    if (file) {
      const originalBuffer = file.buffer
      imageKey = `users/${userId}/avatar`

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

    await this.prismaService.user.update({
      where: { id: userId },
      data: {
        ...data,
        ...(imageKey && { photo: imagePath }),
      }
    })

    return getStatusOk()
  }

  public async delete(req: Request) {
    const userId = req.session.userId

    await this.prismaService.user.update({
      where: { id: userId },
      data: {
        deletedAt: new Date(),
        email: null,
        phoneNumber: null,
        firstName: null,
        lastName: null,
        photo: null,
        gender: null,
        dateOfBirth: null,
        contacts: null,
      }
    })
  }
}
