import { Controller, Get, HttpCode, HttpStatus, Param, Req } from '@nestjs/common'
import { UserService } from './user.service'
import { Authorization } from '../auth/decorators/auth.decorator'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ProfileResponseDto } from './dto'
import { type Request } from 'express'

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @ApiOperation({ summary: 'Получить профиль пользователя по id' })
  @ApiResponse({
    status: 200, type: ProfileResponseDto
  })
  public async findProfile(@Req() req: Request, @Param('id') id: string) {
    return this.userService.getProfile(req, id)
  }
}
