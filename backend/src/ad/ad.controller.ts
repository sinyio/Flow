import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { AdService } from './ad.service';
import { Authorization } from '../auth/decorators/auth.decorator';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

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
        "title": "Доставка посылки из Москвы в П",
        "image": null,
        "description": "Нужно доставить аккуратно упак",
        "start_date": "2026-03-12 10:00:00",
        "end_date": "2026-03-15 18:00:00",
        "from_city": "Москва",
        "to_city": "Санкт-Петербург",
        "price": 1500,
        "weight": 5,
        "is_fragile": true,
        "is_document": false,
        "packaging": "BOX",
        "length": 30,
        "width": 20,
        "height": 10,
        "created_at": "2026-03-11 23:42:10.952",
        "updated_at": "2026-03-11 23:42:10.952",
        "user_id": "e014cd64-c0c4-428a-840b-d96dc6"
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
  public getById(@Query('id') id: string) {
    return this.adService.findAdById(id);
  }
}
