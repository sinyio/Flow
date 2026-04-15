import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { type Request } from 'express'
import { Authorization } from '../auth/decorators/auth.decorator'
import { MediaService } from './media.service'
import { MediaCommentCreateDto, MediaCommentUpdateDto, MediaListQueryDto, MediaPostCreateDto, MediaPostUpdateDto } from './dto'
import { CanEditMediaComment, CanEditMediaPost } from './guards'

@ApiTags('Media')
@Controller('media')
export class MediaController {
  public constructor(private readonly mediaService: MediaService) {}

  @Get('posts')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Список постов с пагинацией' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Поиск по заголовку поста' })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    enum: ['newest', 'oldest', 'relevant'],
    description: 'Сортировка: newest | oldest | relevant (по просмотрам)',
  })
  @ApiQuery({ name: 'authorId', required: false, type: String })
  @ApiResponse({ status: 200 })
  public async getPosts(@Req() req: Request, @Query() query: MediaListQueryDto) {
    return this.mediaService.getPosts(req, query)
  }

  @Get('posts/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Детали поста' })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiResponse({ status: 200 })
  public async getPostById(@Req() req: Request, @Param('id') id: string) {
    return this.mediaService.getPostById(req, id)
  }

  @Get('posts/:id/comments')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Список корневых комментариев поста с вложенными ответами' })
  @ApiParam({ name: 'id', required: true, type: String, description: 'ID поста' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200 })
  public async getPostComments(@Req() req: Request, @Param('id') id: string, @Query() query: MediaListQueryDto) {
    return this.mediaService.getPostComments(req, id, query)
  }

  @Authorization()
  @Post('posts')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Создать пост' })
  @ApiBody({ type: MediaPostCreateDto })
  @ApiResponse({ status: 200 })
  public async createPost(@Req() req: Request, @Body() dto: MediaPostCreateDto) {
    return this.mediaService.createPost(req, dto)
  }

  @Post('posts/:id/view')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Увеличить количество просмотров поста' })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiResponse({ status: 200 })
  public async addPostView(@Param('id') id: string) {
    return this.mediaService.addView(id)
  }

  @Authorization()
  @Post('posts/:id/like')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Лайкнуть/снять лайк с поста' })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiResponse({ status: 200 })
  public async togglePostLike(@Req() req: Request, @Param('id') id: string) {
    return this.mediaService.togglePostLike(req, id)
  }

  @Authorization()
  @Post('posts/:id/favorite')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Добавить/убрать пост из избранного' })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiResponse({ status: 200 })
  public async togglePostFavorite(@Req() req: Request, @Param('id') id: string) {
    return this.mediaService.togglePostFavorite(req, id)
  }

  @Authorization()
  @Post('posts/:id/comments')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Создать комментарий или ответ на комментарий' })
  @ApiParam({ name: 'id', required: true, type: String, description: 'ID поста' })
  @ApiBody({ type: MediaCommentCreateDto })
  @ApiResponse({ status: 200 })
  public async createComment(@Req() req: Request, @Param('id') id: string, @Body() dto: MediaCommentCreateDto) {
    return this.mediaService.createComment(req, id, dto)
  }

  @Authorization()
  @Post('comments/:id/like')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Лайкнуть/снять лайк с комментария' })
  @ApiParam({ name: 'id', required: true, type: String, description: 'ID комментария' })
  @ApiResponse({ status: 200 })
  public async toggleCommentLike(@Req() req: Request, @Param('id') id: string) {
    return this.mediaService.toggleCommentLike(req, id)
  }

  @Authorization()
  @Patch('posts/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Редактировать пост' })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiBody({ type: MediaPostUpdateDto })
  @ApiResponse({ status: 200 })
  @UseGuards(CanEditMediaPost)
  public async patchPost(@Param('id') id: string, @Body() dto: MediaPostUpdateDto) {
    return this.mediaService.updatePost(id, dto)
  }

  @Authorization()
  @Delete('posts/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Удалить пост' })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiResponse({ status: 200 })
  @UseGuards(CanEditMediaPost)
  public async deletePost(@Param('id') id: string) {
    return this.mediaService.deletePost(id)
  }

  @Authorization()
  @Patch('comments/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Редактировать комментарий' })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiBody({ type: MediaCommentUpdateDto })
  @ApiResponse({ status: 200 })
  @UseGuards(CanEditMediaComment)
  public async patchComment(@Param('id') id: string, @Body() dto: MediaCommentUpdateDto) {
    return this.mediaService.updateComment(id, dto)
  }

  @Authorization()
  @Delete('comments/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Удалить комментарий' })
  @ApiParam({ name: 'id', required: true, type: String })
  @ApiResponse({ status: 200 })
  @UseGuards(CanEditMediaComment)
  public async deleteComment(@Param('id') id: string) {
    return this.mediaService.deleteComment(id)
  }
}

