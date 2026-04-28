import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ComplaintType } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateComplaintDto {
  @ApiProperty({ enum: ComplaintType, example: ComplaintType.AD, description: 'Тип жалобы' })
  @IsEnum(ComplaintType)
  @IsNotEmpty()
  type: ComplaintType

  @ApiProperty({ example: 'Мошенник, не выполнил доставку', description: 'Текст жалобы' })
  @IsString()
  @IsNotEmpty()
  text: string

  @ApiPropertyOptional({ example: 'uuid', description: 'Id пользователя (для жалобы на пользователя)' })
  @IsOptional()
  @IsString()
  targetUserId?: string

  @ApiPropertyOptional({ example: 'uuid', description: 'Id объявления (для жалобы на объявление)' })
  @IsOptional()
  @IsString()
  targetAdId?: string

  @ApiPropertyOptional({ example: 'uuid', description: 'Id поста (для жалобы на пост)' })
  @IsOptional()
  @IsString()
  targetPostId?: string
}
