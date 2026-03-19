import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min, IsUUID, IsBoolean } from 'class-validator'

export class ReviewCreateDto {
  @ApiProperty({
    example: '11111111-1111-1111-1111-111111111111',
    description: 'Id объявления',
  })
  @IsString()
  @IsNotEmpty()
  adId: string

  @ApiProperty({
    example: 5,
    description: 'Оценка (1..5)',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  rating: number

  @ApiPropertyOptional({
    example: 'Отлично! Все прошло вовремя.',
    description: 'Текст отзыва',
  })
  @IsOptional()
  @IsString()
  text?: string | null

  @ApiPropertyOptional({
    example: true,
    description: 'Анонимный отзыв',
  })
  @Type(() => Boolean)
  @IsOptional()
  @IsBoolean()
  isAnonymous: boolean
}

