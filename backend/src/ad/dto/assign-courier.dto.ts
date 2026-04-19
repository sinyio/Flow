import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class AssignCourierDto {
  @ApiProperty({ description: 'Id пользователя-курьера (из чата по отклику)', example: 'courier-user-id' })
  @IsString()
  @IsNotEmpty({ message: 'Укажите курьера' })
  courierId: string
}
