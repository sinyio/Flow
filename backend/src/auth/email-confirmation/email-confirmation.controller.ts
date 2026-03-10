import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common'
import { EmailConfirmationService } from './email-confirmation.service'
import { type Request } from 'express'
import { ConfirmationDto } from './dto'
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger'

@ApiTags('auth')
@Controller('auth/email-confirmation')
export class EmailConfirmationController {
  constructor(private readonly emailConfirmationService: EmailConfirmationService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm email with token' })
  @ApiBody({ type: ConfirmationDto })
  @ApiResponse({ status: 200, description: 'Email successfully confirmed' })
  public async newVerification(@Req() req: Request, @Body() dto: ConfirmationDto) {
    return this.emailConfirmationService.newVerification(req, dto)
  }
}
