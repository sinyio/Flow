import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { type Request } from 'express'
import { Authorization } from '@/src/auth/decorators/auth.decorator'
import { ReviewService } from './review.service'
import { ReviewCreateDto, ReviewListQueryDto, ReviewPaginatedResponseDto, ReviewResponseDto, ReviewTargetRole, ReviewUpdateDto } from './dto'

@ApiTags('Reviews')
@Controller('review')
export class ReviewController {
  public constructor(private readonly reviewService: ReviewService) {}

  @Authorization()
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Оставить отзыв' })
  @ApiBody({ type: ReviewCreateDto })
  @ApiResponse({ status: 200, type: ReviewResponseDto })
  public async putReview(@Req() req: Request, @Body() dto: ReviewCreateDto) {
    return this.reviewService.putReview(req, dto)
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Получить отзыв по id' })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiResponse({ status: 200, type: ReviewResponseDto })
  public async getReview(@Param('id') id: string) {
    return this.reviewService.getReview(id)
  }

  @Authorization()
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Удалить свой отзыв' })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiResponse({ status: 200 })
  public async deleteReview(@Req() req: Request, @Param('id') id: string) {
    return this.reviewService.deleteReview(req, id)
  }

  @Authorization()
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Обновить свой отзыв' })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiBody({ type: ReviewUpdateDto })
  @ApiResponse({ status: 200, type: ReviewResponseDto })
  public async patchReview(@Req() req: Request, @Param('id') id: string, @Body() dto: ReviewUpdateDto) {
    return this.reviewService.patchReview(req, id, dto)
  }

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Получить отзывы пользователя (как courier/customer/all)' })
  @ApiParam({ name: 'userId', required: true, type: String, description: 'Id пользователя' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'role',
    required: false,
    enum: ReviewTargetRole,
    description: 'courier — отзывы, где пользователь является курьером; customer — заказчиком; all — всё вместе',
  })
  @ApiResponse({ status: 200, type: ReviewPaginatedResponseDto })
  public async getReviewsByUser(
    @Param('userId') userId: string,
    @Query() query: ReviewListQueryDto,
  ) {
    return this.reviewService.getReviewsByTarget(userId, query)
  }
}
