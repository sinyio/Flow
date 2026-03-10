import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator'

export class RegisterDto {
  @IsString({ message: 'Email должен быть строкой' })
  @IsNotEmpty({ message: 'Email обязателен для заполенния' })
  @IsEmail({}, { message: 'Некорректный формат email' })
  email: string

  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль обязателен для заполнения' })
  @MinLength(8, { message: 'Пароль должен содержать минимум 8 символов' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/, {
    message:
      'Пароль должен содержать заглавные и строчные буквы, минимум одну цифру и один спецсимвол',
  })
  password: string
}
