import { ApiPropertyOptional } from '@nestjs/swagger'
import { PaginationDto } from '@/src/common/dto'
import { Type } from 'class-transformer'
import { IsEnum, IsOptional } from 'class-validator'

export enum ReviewTargetRole {
  COURIER = 'courier',
  CUSTOMER = 'customer',
  ALL = 'all',
}

export class ReviewListQueryDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Кого считать целевым пользователем: courier (курьер), customer (заказчик) или all (всё)',
    enum: ReviewTargetRole,
    example: ReviewTargetRole.ALL,
  })
  @IsOptional()
  @IsEnum(ReviewTargetRole)
  role?: ReviewTargetRole = ReviewTargetRole.ALL
}

