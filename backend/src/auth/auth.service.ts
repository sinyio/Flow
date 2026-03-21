import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { LoginDto, RegisterDto } from './dto'
import { UserService } from '../user/user.service'
import { User } from '@prisma/client'

import { type Response, type Request } from 'express'
import { verify } from 'argon2'
import { ConfigService } from '@nestjs/config'
import { EmailConfirmationService } from './email-confirmation/email-confirmation.service'

@Injectable()
export class AuthService {
  public constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly emailConfirmationService: EmailConfirmationService,
  ) { }

  public async register(req: Request, dto: RegisterDto) {
    const isExists = await this.userService.findByEmail(dto.email)

    if (isExists) {
      throw new ConflictException('Пользователь с таким email уже существует.')
    }

    const newUser = await this.userService.create(dto.email, dto.password)

    await this.emailConfirmationService.sendVerificationToken(newUser)

    return {
      stasus: 'ok',
      message: 'Вы успешно зарегистрировались. Пожалуйста, подтвердите email',
    }
  }

  public async login(req: Request, dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email)

    if (!user) {
      throw new NotFoundException('Неверное сочетание логина и пароля')
    }

    const isValidPassword = await verify(user.password, dto.password)

    if (!isValidPassword) {
      throw new UnauthorizedException('Неверное сочетание логина и пароля')
    }

    if (!user.isVerified) {
      await this.emailConfirmationService.sendVerificationToken(user)
      throw new UnauthorizedException(
        'Ваш email не подтвержден. Пожалуйста, проверьте вашу почту и подтвердите адрес',
      )
    }

    await this.saveSession(req, user)

    return {
      userId: user.id,
    }
  }

  public async logout(req: Request, res: Response) {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          return reject(new InternalServerErrorException('Не удалось завершить сессию'))
        }
      })

      res.clearCookie(this.configService.getOrThrow('SESSION_NAME'))
      resolve({ status: 'ok' })
    })
  }

  public async saveSession(req: Request, user: User) {
    return new Promise((resolve, reject) => {
      req.session.userId = user.id

      req.session.save((err) => {
        if (err) {
          console.log(err)
          return reject(new InternalServerErrorException('Не удалось сохранить сессию'))
        }

        resolve({ status: 'ok' })
      })
    })
  }
}
