import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Req, UploadedFile, UseInterceptors } from '@nestjs/common'
import { UserService } from './user.service'
import { Authorization } from '../auth/decorators/auth.decorator'
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ProfileResponseDto } from './dto'
import { type Request } from 'express'
import { UpdateProfileDto } from './dto/update-profile.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { getStatusOk } from '../common/helpers'

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @ApiOperation({ summary: 'Получить профиль пользователя по id' })
  @ApiResponse({
    status: 200, type: ProfileResponseDto
  })
  public async findProfile(@Req() req: Request, @Param('id') id: string) {
    return this.userService.getProfile(req, id)
  }

  @HttpCode(HttpStatus.OK)
  @Patch()
  @Authorization()
  @ApiOperation({ summary: 'Обновить профиль' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({
    status: 200, schema: {
      example: getStatusOk(),
    }
  })
  @UseInterceptors(FileInterceptor('photo'))
  public async updateProfile(@Req() req: Request, @Body() dto: UpdateProfileDto, @UploadedFile() file) {
    return this.userService.updateProfile(req, dto, file)
  }

  @HttpCode(HttpStatus.OK)
  @Delete()
  @Authorization()
  @ApiOperation({ summary: 'Удалить профиль' })
  @ApiResponse({
    status: 200, schema: {
      example: getStatusOk(),
    }
  })
  public async deleteProfile(@Req() req: Request) {
    return this.userService.delete(req)
  }
}
