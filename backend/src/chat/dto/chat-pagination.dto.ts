import { PaginationDto } from '@/src/common/dto'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class ChatPaginationDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Поиск по чату (текст/участник)', example: 'Москва' })
  @IsOptional()
  @IsString()
  q?: string
}

