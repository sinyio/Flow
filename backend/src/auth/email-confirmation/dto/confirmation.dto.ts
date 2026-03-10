import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ConfirmationDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Токен для подтверждения email',
  })
  @IsString({ message: 'Токен должен быть строкой' })
  @IsNotEmpty({ message: 'Поле токен не может быть пустым' })
  token: string
}
