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
  public getById(@Query('id') id: string) {
    return this.adService.findAdById(id);
  }
}
