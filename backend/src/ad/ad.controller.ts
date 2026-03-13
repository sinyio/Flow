import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { AdService } from './ad.service';
import { Authorization } from '../auth/decorators/auth.decorator';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdDto, AdFilterDto, AdPaginatedResponseDto, AdResponseDto } from './dto';
import { type Request } from 'express';
import { getStatusOk } from '../common/helpers';

@ApiTags('Ads')
@Controller('ads')
export class AdController {
  constructor(private readonly adService: AdService) { }

  // @Authorization()
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @ApiOperation({ summary: 'Получить объявление по id' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Id объявления',
    type: String,
  })
  @ApiResponse({
    status: 200, type: AdResponseDto
  })
  @ApiResponse({
    status: 404, schema: {
      example: {
        message: "Объявление не найдено",
        error: "Not Found",
        statusCode: 404
      },
    }
  })
  public getById(@Req() req: Request, @Param('id') id: string) {
    return this.adService.findAdById(req, id);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiOperation({ summary: 'Получить все объявления (с фильтрами)' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Номер страницы (по умолчанию 1)',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Размер страницы (по умолчанию 10)',
    type: Number,
  })
  @ApiQuery({
    name: 'isDocument',
    required: false,
    description: 'Документы',
    type: Boolean,
  })
  @ApiQuery({
    name: 'isFragile',
    required: false,
    description: 'Хрупкое',
    type: Boolean,
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    description: 'Минимальная цена',
    type: Number,
  })
  @ApiQuery({
    name: 'fromCity',
    required: false,
    description: 'Город отправления',
    type: String,
  })
  @ApiQuery({
    name: 'toCity',
    required: false,
    description: 'Город назначения',
    type: String,
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Дата отправления (ISO, например 2026-03-12)',
    type: String,
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Дата прибытия (ISO, например 2026-03-15)',
    type: String,
  })
  @ApiResponse({
    status: 200, type: AdPaginatedResponseDto
  })
  public getAll(@Req() req: Request, @Query() filters: AdFilterDto) {
    return this.adService.findAll(req, filters)
  }

  @HttpCode(HttpStatus.OK)
  @Post()
  @ApiBody({ type: AdDto })
  @ApiOperation({ summary: 'Создать объявление' })
  @ApiResponse({
    status: 200, schema: {
      example: getStatusOk(),
    }
  })
  @ApiResponse({
    status: 400, schema: {
      example: {
        "message": [
          "Вес посылки обязателен"
        ],
        "error": "Bad Request",
        "statusCode": 400
      },
    }
  })
  public create(@Req() req: Request, @Body() ad: AdDto) {
    return this.adService.create(req, ad)
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  @ApiOperation({ summary: 'Обновить объявление' })
  @ApiParam({ name: 'id', example: 'ad_123' })
  @ApiResponse({
    status: 200, schema: {
      example: getStatusOk(),
    }
  })
  public update(@Req() req: Request, @Param('id') id: string, @Body() ad: AdDto) {
    return this.adService.update(req, id, ad)
  }
}
