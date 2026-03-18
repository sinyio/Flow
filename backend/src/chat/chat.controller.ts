import { Controller, Get, HttpCode, HttpStatus, Param, Query, Req, UseGuards } from '@nestjs/common'
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { type Request } from 'express'
import { AuthGuard } from '@/src/auth/guards/auth.guard'
import { ChatService } from './chat.service'
import { ChatPaginationDto, MessagePaginationDto } from './dto'

@ApiTags('Chat')
@Controller('chats')
export class ChatController {
  public constructor(private readonly chatService: ChatService) {}

  @Get()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Получить мои чаты' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'q', required: false, type: String })
  @ApiResponse({ status: 200 })
  public async getMyChats(@Req() req: Request, @Query() query: ChatPaginationDto) {
    const userId = req.session.userId
    return this.chatService.getMyChats(userId, query.page ?? 1, query.limit ?? 20, query.q)
  }

  @Get(':chatId/messages')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Получить сообщения чата' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200 })
  public async getChatMessages(
    @Req() req: Request,
    @Param('chatId') chatId: string,
    @Query() query: MessagePaginationDto,
  ) {
    const userId = req.session.userId
    return this.chatService.getChatMessages(userId, chatId, query.page ?? 1, query.limit ?? 50)
  }
}

