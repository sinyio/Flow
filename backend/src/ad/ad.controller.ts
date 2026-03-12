import { Controller, Get, HttpCode, HttpStatus, Param, Query } from '@nestjs/common';
import { AdService } from './ad.service';
import { Authorization } from '../auth/decorators/auth.decorator';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdFilterDto } from './dto';

@ApiTags('Ads')
@Controller('ads')
export class AdController {
  constructor(private readonly adService: AdService) { }

  // @Authorization()
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @ApiOperation({ summary: 'Получить объявление по id' })
  @ApiQuery({
    name: 'id',
    required: true,
    description: 'Id объявления',
    type: String,
  })
  @ApiResponse({
    status: 200, schema: {
      example: {
        "id": "22222222-2222-2222-2222-222222222222",
        "title": "Доставка посылки из Москвы в Питер",
        "image": null,
        "description": "Нужно доставить аккуратно упак",
        "startDate": "2026-03-12 10:00:00",
        "endDate": "2026-03-15 18:00:00",
        "fromCity": "Москва",
        "toCity": "Санкт-Петербург",
        "price": 1500,
        "weight": 5,
        "isFragile": true,
        "isDocument": false,
        "packaging": "BOX",
        "length": 30,
        "width": 20,
        "height": 10,
        "user": {
          id: "123321-12dd1923-d13i-13f5v413",
          photo: "https://photoLink.ru"
        }
      },
    }
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
  public getById(@Param('id') id: string) {
    return this.adService.findAdById(id);
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
    status: 200, schema: {
      example: {
        "data": [
          {
            "id": "22222222-2222-2222-2222-222222222222",
            "title": "Доставка посылки из Москвы в Питер",
            "image": null,
            "description": "Нужно доставить аккуратно упакованную посылку",
            "startDate": "2026-03-12T10:00:00.000Z",
            "endDate": "2026-03-15T18:00:00.000Z",
            "fromCity": "Москва",
            "toCity": "Санкт-Петербург",
            "price": 1500,
            "weight": 5,
            "isFragile": true,
            "isDocument": false,
            "packaging": "BOX",
            "length": 30,
            "width": 20,
            "height": 10,
            "user": {
              "id": "e014cd64-c0c4-428a-840b-d96dc60a4f29",
              "photo": null
            }
          }
        ],
        "meta": {
          "page": 1,
          "limit": 5,
          "total": 1,
          "pages": 1
        }
      },
    }
  })
  public getAll(@Query() filters: AdFilterDto) {
    return this.adService.findAll(filters)
  }
}
