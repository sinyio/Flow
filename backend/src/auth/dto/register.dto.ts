import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя',
  })
  @IsString({ message: 'Email должен быть строкой' })
  @IsNotEmpty({ message: 'Email обязателен для заполенния' })
  @IsEmail({}, { message: 'Некорректный формат email' })
  email: string

  @ApiProperty({
    example: 'Qwerty123!',
    description:
      'Пароль минимум 8 символов: заглавные и строчные буквы, минимум одна цифра и один спецсимвол',
  })
  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль обязателен для заполнения' })
  @MinLength(8, { message: 'Пароль должен содержать минимум 8 символов' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/, {
    message:
      'Пароль должен содержать заглавные и строчные буквы, минимум одну цифру и один спецсимвол',
  })
  password: string
}
