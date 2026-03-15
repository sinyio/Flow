import { getUserResponse } from '@/src/user/dto'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Ad, Packaging, User } from '@prisma/client'
import { IsNotEmpty, IsOptional, MinLength } from 'class-validator'
import { AdRoles } from '../types'
import { getUserExample, PaginationMetaDto } from '@/src/common/swagger-examples'
import { Type } from 'class-transformer'

type AdWithUsers = Ad & { author: User, sender: User | null, recipient: User | null }

export class AdDto {
  @ApiProperty({
    example: 'Новое объявление',
    description: 'Название объявления',
  })
  @IsNotEmpty({ message: 'Название объявления обязательно для заполенния' })
  title: string

  @ApiProperty({
    example: '2026-03-12T00:00:00.000Z',
  })
  @IsNotEmpty({ message: 'Начало периода доставки обязательно' })
  startDate: Date

  @ApiProperty({
    example: '2026-03-20T00:00:00.000Z',
  })
  @IsNotEmpty({ message: 'Конец периода доставки обязательно' })
  endDate: Date

  @ApiProperty({
    example: 'Москва',
  })
  @IsNotEmpty({ message: 'Город отправления доставки обязателен' })
  fromCity: string

  @ApiProperty({
    example: 'Саратов',
  })
  @IsNotEmpty({ message: 'Город получения доставки обязателен' })
  toCity: string

  @Type(() => Number)
  @ApiProperty({
    example: 0.5,
  })
  @IsNotEmpty({ message: 'Вес посылки обязателен' })
  weight: number

  @Type(() => Number)
  @ApiProperty({
    example: 40,
  })
  @IsNotEmpty({ message: 'Длина посылки обязательна' })
  length: number

  @Type(() => Number)
  @ApiProperty({
    example: 30,
  })
  @IsNotEmpty({ message: 'Ширины посылки обязательна' })
  width: number

  @Type(() => Number)
  @ApiProperty({
    example: 20,
  })
  @IsNotEmpty({ message: 'Высота посылки обязательная' })
  height: number

  @Type(() => Number)
  @ApiProperty({
    example: 2000,
  })
  @IsNotEmpty({ message: 'Вознаграждание обязательно' })
  price: number

  @ApiProperty({
    example: 'BOX',
  })
  @IsNotEmpty({ message: 'Вид упаковки обязателен' })
  packaging: Packaging

  @ApiProperty({
    example: 'sender',
  })
  @IsNotEmpty({ message: 'Роль обязательна' })
  role: AdRoles

  @Type(() => Boolean)
  @ApiProperty({
    example: true,
  })
  isFragile: boolean

  @Type(() => Boolean)
  @ApiProperty({
    example: false,
  })
  isDocument: boolean

  @ApiPropertyOptional()
  description?: string

  @ApiProperty({ type: 'string', format: 'binary' })
  image: any
}

export class AdResponseDto {

  @ApiProperty({ example: '22222222-2222-2222-2222-222222222222' })
  id: string

  @ApiProperty({ example: 'Новое объявление' })
  title: string

  @ApiProperty({ example: null })
  image: string | null

  @ApiProperty({ example: 'Нужно доставить аккуратно' })
  description: string

  @ApiProperty({ example: '2026-03-12T00:00:00.000Z' })
  startDate: Date

  @ApiProperty({ example: '2026-03-20T00:00:00.000Z' })
  endDate: Date

  @ApiProperty({ example: 'Москва' })
  fromCity: string

  @ApiProperty({ example: 'Саратов' })
  toCity: string

  @ApiProperty({ example: 2000 })
  price: number

  @ApiProperty({ example: 0.5 })
  weight: number

  @ApiProperty({ example: true })
  isFragile: boolean

  @ApiProperty({ example: false })
  isDocument: boolean

  @ApiProperty({
    enum: Packaging,
    example: Packaging.BOX
  })
  packaging: Packaging

  @ApiProperty({ example: 40 })
  length: number

  @ApiProperty({ example: 30 })
  width: number

  @ApiProperty({ example: 20 })
  height: number

  @ApiProperty({
    example: {
      canEdit: false,
      role: AdRoles.VIEWER
    }
  })
  userState: {
    canEdit: boolean
    role: AdRoles
  }

  @ApiProperty({
    example: getUserExample()
  })
  author: any

  @ApiProperty({
    example: getUserExample(),
    nullable: true
  })
  sender: any | null

  @ApiProperty({
    example: getUserExample(),
    nullable: true
  })
  recipient: any | null
}

export class AdPaginatedResponseDto {
  @ApiProperty({ type: () => [AdResponseDto] })
  data: AdResponseDto[]

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto
}

export const getAdResponse = (ad: AdWithUsers, userId?: string) => ({
  id: ad.id,
  title: ad.title,
  image: ad.image,
  description: ad.description,
  startDate: ad.startDate,
  endDate: ad.endDate,
  fromCity: ad.fromCity,
  toCity: ad.toCity,
  price: ad.price,
  weight: ad.weight,
  isFragile: ad.isFragile,
  isDocument: ad.isDocument,
  packaging: ad.packaging,
  length: ad.length,
  width: ad.width,
  height: ad.height,
  userState: {
    canEdit: ad.authorId === userId,
    role: ad.senderId === userId ? 'sender' : ad.recipientId === userId ? 'recipient' : 'viewer',
  },
  author: getUserResponse(ad.author),
  sender: ad.sender ? getUserResponse(ad.sender) : null,
  recipient: ad.recipient ? getUserResponse(ad.recipient) : null,
})