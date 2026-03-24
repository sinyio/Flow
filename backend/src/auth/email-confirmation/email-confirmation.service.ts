import { PrismaService } from '@/src/prisma/prisma.service'
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { TokenType, User } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
import { type Request } from 'express'
import { ConfirmationDto, PasswordResetDto, SendPasswordResetTokenDto } from './dto'
import { MailService } from '@/src/mail/mail.service'
import { UserService } from '@/src/user/user.service'
import { AuthService } from '../auth.service'
import { getStatusOk } from '@/src/common/helpers'
import { hash } from 'argon2'

@Injectable()
export class EmailConfirmationService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) { }

  public async newVerification(req: Request, dto: ConfirmationDto) {
    const existingToken = await this.prismaService.token.findUnique({
      where: {
        token: dto.token,
        type: TokenType.VERIFICATION,
      },
    })

    if (!existingToken) {
      throw new NotFoundException('Токен подтверждения не найден')
    }

    const hasExpired = new Date(existingToken.expiresIn) < new Date()

    if (hasExpired) {
      throw new BadRequestException(
        'Токен подверждения истек. Пожалуйста, запросите новый токен для подтверждения',
      )
    }

    const existingUser = await this.userService.findByEmail(existingToken.email)

    if (!existingUser) {
      throw new NotFoundException('Пользователь с указанным адресом электронной почты не найден')
    }

    await this.prismaService.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        isVerified: true,
      },
    })

    await this.prismaService.token.delete({
      where: {
        id: existingToken.id,
        type: TokenType.VERIFICATION,
      },
    })

    return this.authService.saveSession(req, existingUser)
  }

  public async passwordReset(req: Request, dto: PasswordResetDto) {
    const existingToken = await this.prismaService.token.findUnique({
      where: {
        token: dto.token,
        type: TokenType.PASSWORD_RESET,
      },
    })

    if (!existingToken) {
      throw new NotFoundException('Токен восстновления пароля не найден')
    }

    const hasExpired = new Date(existingToken.expiresIn) < new Date()

    if (hasExpired) {
      throw new BadRequestException('Токен восстановления пароля истек')
    }

    const existingUser = await this.userService.findByEmail(existingToken.email)

    if (!existingUser) {
      throw new NotFoundException('Пользователь с указанным адресом электронной почты не найден')
    }

    await this.prismaService.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        password: await hash(dto.password),
      },
    })

    await this.prismaService.token.delete({
      where: {
        id: existingToken.id,
        type: TokenType.PASSWORD_RESET,
      },
    })

    return getStatusOk({ message: 'Пароль успешно восстановлен' })
  }


  public async sendVerificationToken(user: User) {
    const verificationToken = await this.generateVerificationToken(user.email!)

    await this.mailService.sendConfirmationEmail(verificationToken.email, verificationToken.token)

    return true
  }

  public async sendPasswordResetToken(dto: SendPasswordResetTokenDto) {
    const existingUser = await this.userService.findByEmail(dto.email!)

    if (!existingUser) {
      throw new NotFoundException('Пользователь с указанным адресом электронной почты не найден')
    }

    const passwordResetToken = await this.generatePasswordResetToken(dto.email!)

    await this.mailService.sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token)

    return getStatusOk({ message: 'Токен для восстановления пароля отправлен' })
  }

  private async generateVerificationToken(email: string) {
    const token = uuidv4()
    const expiresIn = new Date(new Date().getTime() + 3600 * 1000)

    const existingToken = await this.prismaService.token.findFirst({
      where: {
        email,
        type: TokenType.VERIFICATION,
      },
    })

    if (existingToken) {
      await this.prismaService.token.delete({
        where: {
          id: existingToken.id,
          type: TokenType.VERIFICATION,
        },
      })
    }

    const verificationToken = await this.prismaService.token.create({
      data: {
        email,
        token,
        expiresIn,
        type: TokenType.VERIFICATION,
      },
    })

    return verificationToken
  }

  private async generatePasswordResetToken(email: string) {
    const token = uuidv4()
    const expiresIn = new Date(new Date().getTime() + 3600 * 1000)

    const existingToken = await this.prismaService.token.findFirst({
      where: {
        email,
        type: TokenType.PASSWORD_RESET,
      },
    })

    if (existingToken) {
      await this.prismaService.token.delete({
        where: {
          id: existingToken.id,
          type: TokenType.PASSWORD_RESET,
        },
      })
    }

    const passwordResetToken = await this.prismaService.token.create({
      data: {
        email,
        token,
        expiresIn,
        type: TokenType.PASSWORD_RESET,
      },
    })

    return passwordResetToken
  }
}
