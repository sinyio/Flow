import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class MediaPostCreateDto {
  @ApiPropertyOptional({ description: 'Заголовок поста', example: 'Мой первый пост' })
  @IsOptional()
  @IsString()
  title?: string

  @ApiPropertyOptional({ description: 'Содержание поста', example: 'Привет, это мой первый пост!' })
  @IsOptional()
  @IsString()
  content?: string

  @ApiPropertyOptional({ description: 'Изображение', type: 'string', format: 'binary' })
  @IsOptional()
  image?: any
}

