import { ApiPropertyOptional } from '@nestjs/swagger'
import { ComplaintType } from '@prisma/client'
import { Type } from 'class-transformer'
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator'

export class GetComplaintsQueryDto {
  @ApiPropertyOptional({ enum: ComplaintType, description: 'Фильтр по типу жалобы' })
  @IsOptional()
  @IsEnum(ComplaintType)
  type?: ComplaintType

  @ApiPropertyOptional({ example: 1, description: 'Номер страницы' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1

  @ApiPropertyOptional({ example: 20, description: 'Размер страницы' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20
}
