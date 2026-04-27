import { ApiProperty } from '@nestjs/swagger'
import { PaginationMetaDto } from '@/src/common/swagger-examples'

class MessageSenderDto {
  @ApiProperty({ example: '11111111-1111-1111-1111-111111111111' })
  id: string

  @ApiProperty({ example: 'user@example.com' })
  email: string

  @ApiProperty({ example: 'Иван', nullable: true })
  firstName: string | null

  @ApiProperty({ example: 'Иванов', nullable: true })
  lastName: string | null

  @ApiProperty({ example: 'https://example.com/photo.jpg', nullable: true })
  photo: string | null
}

class MessageFileDto {
  @ApiProperty({ example: '66666666-6666-6666-6666-666666666666' })
  id: string

  @ApiProperty({ example: 'https://example.com/file.png' })
  url: string

  @ApiProperty({ example: 'image/png' })
  mimeType: string

  @ApiProperty({ example: 'file.png' })
  fileName: string

  @ApiProperty({ example: 123456 })
  size: number

  @ApiProperty({ example: '2026-03-12T10:00:00.000Z' })
  createdAt: Date
}

export class MessageResponseDto {
  @ApiProperty({ example: '33333333-3333-3333-3333-333333333333' })
  id: string

  @ApiProperty({ example: '44444444-4444-4444-4444-444444444444' })
  chatId: string

  @ApiProperty({ example: 'Привет!', nullable: true })
  text: string | null

  @ApiProperty({ example: 'REGULAR', enum: ['REGULAR', 'AD_RESPONSE'] })
  type: 'REGULAR' | 'AD_RESPONSE'

  @ApiProperty({ example: '2026-03-12T10:00:00.000Z' })
  createdAt: Date

  @ApiProperty({ type: MessageSenderDto })
  sender: MessageSenderDto

  @ApiProperty({ type: () => [MessageFileDto] })
  files: MessageFileDto[]
}

export class MessagePaginatedResponseDto {
  @ApiProperty({ type: () => [MessageResponseDto] })
  data: MessageResponseDto[]

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto
}

