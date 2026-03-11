import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common'
import { UserService } from './user.service'
import { Authorized } from '../auth/decorators/authorized.decorator'
import { Authorization } from '../auth/decorators/auth.decorator'
import { UserRole } from '@prisma/client'
import { ApiOperation } from '@nestjs/swagger'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Authorization(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get('profile')
  @ApiOperation({ summary: 'Получить объявление по id' })
  public async findProfile(@Authorized('id') userId: string) {
    return this.userService.findById(userId)
  }
}
