import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AdService } from './ad.service';
import { Authorization } from '../auth/decorators/auth.decorator';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdDto, AdFilterDto, AdPaginatedResponseDto, AdResponseDto, AdUpdateDto, PopularRoutesResponseDto } from './dto';
import { type Request } from 'express';
import { getStatusOk } from '../common/helpers';
import { CanEditAd } from './guards';
import { FileInterceptor } from '@nestjs/platform-express'

@ApiTags('Ads')
@Controller('ads')
export class AdController {
  constructor(private readonly adService: AdService) { }

  @HttpCode(HttpStatus.OK)
  @Get('popular-routes')
  @ApiOperation({ summary: 'Получить популярные маршруты (с последними объявлениями)' })
  @ApiResponse({
    status: 200, type: [PopularRoutesResponseDto]
  })
  public getPopularRoutes(@Req() req: Request) {
    return this.adService.getPopularRoutes(req)
  }

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
    name: 'maxWeight',
    required: false,
    description: 'Максимальный вес',
    type: Number,
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
    name: 'endDate',
    required: false,
    description: 'Дата прибытия (ISO, например 2026-03-15 или 2026-03-15T00:00:00.000Z)',
    type: String,
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Дата отправления (ISO, например 2026-03-12 или 2026-03-12T00:00:00.000Z)',
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
  @ApiConsumes('multipart/form-data')
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
  @UseInterceptors(FileInterceptor('image'))
  public create(@Req() req: Request, @Body() ad: AdDto, @UploadedFile() file) {
    return this.adService.create(req, ad, file)
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  @ApiOperation({ summary: 'Обновить объявление' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: AdUpdateDto })
  @ApiParam({ name: 'id', example: 'ad_123' })
  @ApiResponse({
    status: 200, schema: {
      example: getStatusOk(),
    }
  })
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(CanEditAd)
  public update(@Req() req: Request, @Param('id') id: string, @Body() ad: AdUpdateDto, @UploadedFile() file) {
    return this.adService.update(req, id, ad, file)
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  @ApiOperation({ summary: 'Удалить объявление' })
  @ApiParam({ name: 'id', example: 'ad_123' })
  @ApiResponse({
    status: 200, schema: {
      example: getStatusOk(),
    }
  })
  @UseGuards(CanEditAd)
  public delete(@Req() req: Request, @Param('id') id: string) {
    return this.adService.delete(req, id)
  }
}
