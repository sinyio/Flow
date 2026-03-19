import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ReviewType } from '@prisma/client'
import { Type } from 'class-transformer'
import { IsBoolean, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

export class ReviewUpdateDto {
  @ApiProperty({
    example: 5,
    description: 'Оценка (1..5)',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number

  @ApiPropertyOptional({
    example: 'Все отлично!',
    description: 'Текст отзыва',
  })
  @IsOptional()
  @IsString()
  text?: string | null

  @ApiPropertyOptional({
    example: true,
    description: 'Анонимный отзыв',
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isAnonymous: boolean
}

