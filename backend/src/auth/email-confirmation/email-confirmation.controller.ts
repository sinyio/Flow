import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common'
import { EmailConfirmationService } from './email-confirmation.service'
import { type Request } from 'express'
import { ConfirmationDto, PasswordResetDto, SendPasswordResetTokenDto } from './dto'
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger'

@ApiTags('Auth')
@Controller('auth/email-confirmation')
export class EmailConfirmationController {
  constructor(private readonly emailConfirmationService: EmailConfirmationService) { }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Подтвердить аккаунт по токену' })
  @ApiBody({ type: ConfirmationDto })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        status: 'ok',
      },
    },
  })
  public async newVerification(@Req() req: Request, @Body() dto: ConfirmationDto) {
    return this.emailConfirmationService.newVerification(req, dto)
  }

  @Post('password-reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Восстановить пароль по токену' })
  @ApiBody({ type: PasswordResetDto })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        status: 'ok',
        message: 'Пароль успешно восстановлен',
      },
    },
  })
  public async passwordReset(@Req() req: Request, @Body() dto: PasswordResetDto) {
    return this.emailConfirmationService.passwordReset(req, dto)
  }

  @Post('send-password-reset-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Отправить токен для восстановления пароля' })
  @ApiBody({ type: SendPasswordResetTokenDto })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        status: 'ok',
        message: 'Токен для восстановления пароля отправлен',
      },
    },
  })
  public async sendPasswordResetToken(@Body() dto: SendPasswordResetTokenDto) {
    return this.emailConfirmationService.sendPasswordResetToken(dto)
  }
}
