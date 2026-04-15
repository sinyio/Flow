import { ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsOptional, IsString } from 'class-validator'

export class MediaPostUpdateDto {
  @ApiPropertyOptional({ description: 'Заголовок поста', example: '' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value === '' ? undefined : value))
  title?: string
}

