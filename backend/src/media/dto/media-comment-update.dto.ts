import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsOptional, IsString } from 'class-validator'

export class MediaCommentUpdateDto {
  @ApiPropertyOptional({ description: 'Текст комментария', example: '' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? undefined : value))
  text?: string
}

