import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { PaginationMetaDto } from '@/src/common/swagger-examples'
import { ReviewType } from '@prisma/client'

class ReviewUserDto {
  @ApiProperty({ example: '11111111-1111-1111-1111-111111111111' })
  id: string

  @ApiProperty({ example: 'Иван Иванов' })
  fullName: string

  @ApiPropertyOptional({ example: 'https://example.com/photo.jpg', nullable: true })
  photo: string | null
}

export class ReviewResponseDto {
  @ApiProperty({ example: '22222222-2222-2222-2222-222222222222' })
  id: string

  @ApiProperty({ example: 'ad_nanoid_123' })
  adId: string

  @ApiProperty({ example: 5 })
  rating: number

  @ApiPropertyOptional({ example: 'Отличный клиент', nullable: true })
  text: string | null

  @ApiProperty({ enum: ReviewType, example: ReviewType.CUSTOMER_TO_COURIER })
  type: ReviewType

  @ApiProperty({ example: '2026-03-12T10:00:00.000Z' })
  createdAt: Date

  @ApiProperty({ type: Boolean })
  isAnonymous: boolean

  @ApiProperty({ type: ReviewUserDto })
  author: ReviewUserDto | null

  @ApiProperty({ type: ReviewUserDto })
  target: ReviewUserDto

  @ApiProperty({
    example: {
      canEdit: false,
    }
  })
  userState: {
    canEdit: boolean
  }
}

export class ReviewPaginatedResponseDto {
  @ApiProperty({ type: () => [ReviewResponseDto] })
  data: ReviewResponseDto[]

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto
}

