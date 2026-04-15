import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class MediaPostCreateDto {
  @ApiPropertyOptional({ description: 'Заголовок поста', example: 'Мой первый пост' })
  @IsOptional()
  @IsString()
  title?: string
}

