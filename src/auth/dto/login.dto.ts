import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class LoginDto {
  @IsString({ message: 'Email должен быть строкой' })
  @IsNotEmpty({ message: 'Email обязателен для заполенния' })
  @IsEmail({}, { message: 'Некорректный формат email' })
  email: string

  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль обязателен для заполнения' })
  password: string
}
