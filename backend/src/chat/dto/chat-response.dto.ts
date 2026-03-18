import { ApiProperty } from '@nestjs/swagger'
import { PaginationMetaDto } from '@/src/common/swagger-examples'

class ChatAdDto {
  @ApiProperty({ example: '22222222-2222-2222-2222-222222222222' })
  id: string

  @ApiProperty({ example: 'Доставка посылки из Москвы в Питер' })
  title: string

  @ApiProperty({ example: 'ACTIVE' })
  status: string

  @ApiProperty({ example: 'https://example.com/image.jpg', nullable: true })
  image: string | null
}

class ChatOtherUserDto {
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

class ChatLastMessageDto {
  @ApiProperty({ example: '33333333-3333-3333-3333-333333333333' })
  id: string

  @ApiProperty({ example: 'Привет! Когда удобно забрать?' })
  text: string | null

  @ApiProperty({ example: '2026-03-12T10:00:00.000Z' })
  createdAt: Date

  @ApiProperty({ example: '11111111-1111-1111-1111-111111111111' })
  senderId: string

  @ApiProperty({ example: 0 })
  filesCount: number
}

export class ChatResponseDto {
  @ApiProperty({ example: '44444444-4444-4444-4444-444444444444' })
  id: string

  @ApiProperty({ example: '22222222-2222-2222-2222-222222222222' })
  adId: string

  @ApiProperty({ example: '55555555-5555-5555-5555-555555555555', nullable: true })
  responseId: string | null

  @ApiProperty({ example: '2026-03-12T10:00:00.000Z' })
  createdAt: Date

  @ApiProperty({ example: '2026-03-12T10:05:00.000Z' })
  updatedAt: Date

  @ApiProperty({ type: ChatAdDto })
  ad: ChatAdDto

  @ApiProperty({ type: ChatOtherUserDto, nullable: true })
  otherUser: ChatOtherUserDto | null

  @ApiProperty({ type: ChatLastMessageDto, nullable: true })
  lastMessage: ChatLastMessageDto | null
}

export class ChatPaginatedResponseDto {
  @ApiProperty({ type: () => [ChatResponseDto] })
  data: ChatResponseDto[]

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto
}

