import { ApiPropertyOptional } from '@nestjs/swagger'
import { PaginationDto } from '@/src/common/dto'
import { IsEnum, IsOptional, IsString } from 'class-validator'

export enum MediaPostSort {
  NEWEST = 'newest',
  OLDEST = 'oldest',
  RELEVANT = 'relevant',
}

export enum MediaPostFilter {
  ALL = 'all',
  FLOW = 'flow',
  USERS = 'users',
}

export class MediaListQueryDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Поиск по заголовку поста', example: 'доставка' })
  @IsOptional()
  @IsString()
  search?: string

  @ApiPropertyOptional({
    description: 'Сортировка постов: сначала новые, сначала старые или релевантные (по просмотрам)',
    enum: MediaPostSort,
    example: MediaPostSort.NEWEST,
  })
  @IsOptional()
  @IsEnum(MediaPostSort)
  sort?: MediaPostSort = MediaPostSort.NEWEST

  @ApiPropertyOptional({ description: 'ID автора для фильтрации постов', example: 'user_123' })
  @IsOptional()
  @IsString()
  authorId?: string

  @ApiPropertyOptional({
    description: 'Фильтр постов: all - все посты, flow - только посты от админа, users - только посты от обычных пользователей',
    enum: MediaPostFilter,
    example: MediaPostFilter.ALL,
  })
  @IsOptional()
  @IsEnum(MediaPostFilter)
  filter?: MediaPostFilter = MediaPostFilter.ALL
}

