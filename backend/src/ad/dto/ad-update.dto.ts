import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, IsNumber, IsBoolean, IsEnum } from 'class-validator'
import { AdDtoRoles } from '../types'
import { Packaging } from '@prisma/client'
import { Transform, Type } from 'class-transformer'

export class AdUpdateDto {
  @ApiPropertyOptional({ description: 'Название объявления', example: '' })
  @IsOptional()
  @IsString()
  title?: string

  @ApiPropertyOptional({ description: 'Начало периода доставки', example: '' })
  @IsOptional()
  startDate?: Date

  @ApiPropertyOptional({ description: 'Конец периода доставки', example: '' })
  @IsOptional()
  endDate?: Date

  @ApiPropertyOptional({ description: 'Город отправления', example: '' })
  @IsOptional()
  @IsString()
  fromCity?: string

  @ApiPropertyOptional({ description: 'Город получения', example: '' })
  @IsOptional()
  @IsString()
  toCity?: string

  @ApiPropertyOptional({ description: 'Вес посылки', example: '' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  weight?: number

  @ApiPropertyOptional({ description: 'Длина посылки', example: '' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  length?: number

  @ApiPropertyOptional({ description: 'Ширина посылки', example: '' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  width?: number

  @ApiPropertyOptional({ description: 'Высота посылки', example: '' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  height?: number

  @ApiPropertyOptional({ description: 'Цена', example: '' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  price?: number

  @ApiPropertyOptional({ description: 'Вид упаковки', example: 'BOX', enum: Packaging })
  @IsOptional()
  @IsEnum(Packaging)
  @Transform(({ value }) => value === '' ? undefined : value)
  packaging?: Packaging

  @ApiPropertyOptional({ description: 'Роль', example: 'sender', enum: AdDtoRoles })
  @IsOptional()
  @IsEnum(AdDtoRoles)
  @Transform(({ value }) => value === '' ? undefined : value)
  role?: AdDtoRoles

  @ApiPropertyOptional({ description: 'Хрупкое', example: true })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isFragile?: boolean

  @ApiPropertyOptional({ description: 'Документ', example: true })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isDocument?: boolean

  @ApiPropertyOptional({ description: 'Описание', example: '' })
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({ description: 'Изображение', type: 'string', format: 'binary' })
  @IsOptional()
  image?: any
}