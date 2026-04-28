import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { ComplaintType } from '@prisma/client'

import { AuthGuard } from '../auth/guards/auth.guard'
import { AdminGuard } from './guards/admin.guard'
import { AdminService } from './admin.service'
import { CreateComplaintDto, GetComplaintsQueryDto } from './dto'

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  public constructor(private readonly adminService: AdminService) {}

  @HttpCode(HttpStatus.OK)
  @Post('complaints')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Отправить жалобу' })
  @ApiBody({ type: CreateComplaintDto })
  @ApiResponse({
    status: 200,
    schema: {
      example: { id: 'uuid', type: 'AD', text: 'Текст жалобы', createdAt: '2026-01-01T00:00:00.000Z' },
    },
  })
  @ApiResponse({
    status: 400,
    schema: { example: { message: ['text не должен быть пустым'], error: 'Bad Request', statusCode: 400 } },
  })
  public createComplaint(@Req() req: Request, @Body() dto: CreateComplaintDto) {
    return this.adminService.createComplaint(req['user'].id, dto)
  }

  @HttpCode(HttpStatus.OK)
  @Get('complaints')
  @UseGuards(AuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Получить жалобы (только для администратора)' })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ComplaintType,
    description: 'Фильтр по типу: USER, AD, POST',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Номер страницы (по умолчанию 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Размер страницы (по умолчанию 20)',
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        data: [
          {
            id: 'uuid',
            type: 'AD',
            text: 'Текст жалобы',
            author: { id: 'uuid', firstName: 'Иван', lastName: 'Иванов', photo: null },
            targetAd: { id: 'uuid', title: 'Доставка в Москву' },
            createdAt: '2026-01-01T00:00:00.000Z',
          },
        ],
        total: 1,
        page: 1,
        limit: 20,
      },
    },
  })
  @ApiResponse({ status: 403, schema: { example: { message: 'Доступ только для администраторов', statusCode: 403 } } })
  public getComplaints(@Query() query: GetComplaintsQueryDto) {
    return this.adminService.getComplaints(query)
  }
}
