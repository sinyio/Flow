import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto, RegisterDto } from './dto'

import { type Request, type Response } from 'express'
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger'
import { Authorization } from './decorators/auth.decorator'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  public constructor(private readonly authService: AuthService) { }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 200, schema: {
      example: {
        stasus: 'ok',
        message: 'Вы успешно зарегистрировались. Пожалуйста, подтвердите email'
      },
    }
  })
  @ApiResponse({
    status: 409, schema: {
      example: {
        message: "Пользователь с таким email уже существует",
        error: "Conflict",
        statusCode: 409
      },
    },
  })
  public async register(@Req() req: Request, @Body() dto: RegisterDto) {
    return this.authService.register(req, dto)
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200, schema: {
      example: {
        status: 'ok'
      },
    },
  })
  @ApiResponse({
    status: 404, schema: {
      example: {
        message: "Пользователь не найден",
        error: "Not Found",
        statusCode: 404
      },
    },
  })
  @ApiResponse({
    status: 401, schema: {
      example: {
        message: "Ваш email не подтвержден. Пожалуйста, проверьте вашу почту и подтвердите адрес",
        error: "Unauthorized",
        statusCode: 401
      },
    },
  })
  public async login(@Req() req: Request, @Body() dto: LoginDto) {
    return this.authService.login(req, dto)
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({
    status: 200, schema: {
      example: { status: 'ok' },
    },
  })
  public async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.logout(req, res)
  }

  @Get('me')
  @Authorization()
  @ApiOperation({ summary: 'Проверить, авторизован ли пользователь' })
  @ApiResponse({
    status: 200,
    schema: {
      example: true,
    },
  })
  @ApiResponse({
    status: 401,
    schema: {
      example: {
        message: 'Пользователь не авторизован',
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  public async me() {
    return true
  }

  @Get('qwe')
  @Authorization()
  @ApiOperation({ summary: 'Проверить, авторизован ли пользователь' })
  @ApiResponse({
    status: 200,
    schema: {
      example: true,
    },
  })
  @ApiResponse({
    status: 401,
    schema: {
      example: {
        message: 'Пользователь не авторизован',
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  public async qwe() {
    return true
  }
}
