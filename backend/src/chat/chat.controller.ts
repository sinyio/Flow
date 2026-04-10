import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { type Request, type Response } from 'express'
import { AuthGuard } from '@/src/auth/guards/auth.guard'
import { ChatService } from './chat.service'
import { ChatPaginatedResponseDto, ChatPaginationDto, MessagePaginatedResponseDto, MessagePaginationDto } from './dto'

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
  @ApiResponse({ status: 200, type: ChatPaginatedResponseDto })
  public async getMyChats(@Req() req: Request, @Query() query: ChatPaginationDto) {
    const userId = req.session.userId
    return this.chatService.getMyChats(userId, query.page ?? 1, query.limit ?? 20, query.q)
  }

  @Get(':chatId/messages')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Получить сообщения чата' })
  @ApiParam({ name: 'chatId', required: true, type: String, description: 'Id чата' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, type: MessagePaginatedResponseDto })
  public async getChatMessages(
    @Req() req: Request,
    @Param('chatId') chatId: string,
    @Query() query: MessagePaginationDto,
  ) {
    const userId = req.session.userId
    return this.chatService.getChatMessages(userId, chatId, query.page ?? 1, query.limit ?? 50)
  }

  @Get(':chatId/files/:fileId')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Скачать вложение из чата (только для участников)' })
  @ApiParam({ name: 'chatId', required: true, type: String, description: 'Id чата' })
  @ApiParam({ name: 'fileId', required: true, type: String, description: 'Id файла' })
  public async getChatFile(
    @Req() req: Request,
    @Param('chatId') chatId: string,
    @Param('fileId') fileId: string,
    @Res() res: Response,
  ) {
    const userId = req.session.userId
    const file = await this.chatService.getChatFile(userId, chatId, fileId)

    if (file.fileName) {
      res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(file.fileName)}"`)
    }

    res.setHeader('Content-Type', file.mimeType)
    res.setHeader('Content-Length', String(file.size))
    res.send(file.body)
  }
}

