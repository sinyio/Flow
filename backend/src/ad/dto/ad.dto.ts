import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Packaging } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'
import { AdDtoRoles } from '../types'
import { Type } from 'class-transformer'

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
    example: 'BOX', enum: Packaging
  })
  @IsNotEmpty({ message: 'Вид упаковки обязателен' })
  @IsEnum(Packaging)
  packaging: Packaging

  @ApiProperty({
    example: 'sender',
    enum: AdDtoRoles
  })
  @IsNotEmpty({ message: 'Роль обязательна' })
  @IsEnum(AdDtoRoles)
  role: AdDtoRoles

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
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string

  @ApiProperty({ type: 'string', format: 'binary' })
  image: any
}