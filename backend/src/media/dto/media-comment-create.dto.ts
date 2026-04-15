import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class MediaCommentCreateDto {
  @ApiProperty({ description: 'Текст комментария', example: 'Крутой пост!' })
  @IsString()
  text: string

  @ApiPropertyOptional({ description: 'ID родительского комментария (если это ответ)', example: 'comment_123' })
  @IsOptional()
  @IsString()
  parentId?: string
}

