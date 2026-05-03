import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { type Server, type Socket } from 'socket.io'
import { ConfigService } from '@nestjs/config'
import session from 'express-session'
import { RedisStore } from 'connect-redis'
import { createClient, type RedisClientType } from 'redis'
import cookieParser from 'cookie-parser'
import { ChatService } from './chat.service'

type SocketWithSession = Socket & {
  request: {
    session?: any
    cookies?: Record<string, string>
    signedCookies?: Record<string, string>
  }
}

@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: true,
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer()
  server!: Server

  private redisClient: RedisClientType | null = null
  private sessionMiddleware: any
  private cookieParserMiddleware: any

  public constructor(
    private readonly config: ConfigService,
    private readonly chatService: ChatService,
  ) {
    this.cookieParserMiddleware = cookieParser(this.config.getOrThrow('COOKIES_SECRET'))
  }

  public async afterInit(server: Server) {
    const redisClient: RedisClientType = createClient({
      socket: {
        host: this.config.getOrThrow('REDIS_HOST'),
        port: this.config.getOrThrow('REDIS_PORT'),
      },
      username: this.config.getOrThrow('REDIS_USER'),
      password: this.config.getOrThrow('REDIS_PASSWORD'),
    })

    await redisClient.connect()
    this.redisClient = redisClient

    this.sessionMiddleware = session({
      secret: this.config.getOrThrow('SESSION_SECRET'),
      name: this.config.getOrThrow('SESSION_NAME'),
      resave: true,
      saveUninitialized: false,
      cookie: {
        domain: this.config.getOrThrow('SESSION_DOMAIN'),
        maxAge: undefined,
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      },
      store: new RedisStore({
        client: redisClient,
        prefix: this.config.getOrThrow('SESSION_FOLDER'),
      }),
    })

    server.use((socket: SocketWithSession, next) => {
      this.cookieParserMiddleware(socket.request as any, {} as any, (err: any) => {
        if (err) return next(err)
        this.sessionMiddleware(socket.request as any, {} as any, next)
      })
    })
  }

  public async handleConnection(client: SocketWithSession) {
    const userId = client.request.session?.userId
    if (!userId) {
      client.disconnect(true)
      return
    }
    await client.join(`user:${userId}`)
  }

  @SubscribeMessage('join')
  public async join(
    @ConnectedSocket() client: SocketWithSession,
    @MessageBody() body: { chatId: string },
  ) {
    const userId = client.request.session?.userId
    if (!userId) return { ok: false }

    await this.chatService.assertChatMember(userId, body.chatId)
    await client.join(body.chatId)
    return { ok: true }
  }

  @SubscribeMessage('message')
  public async message(
    @ConnectedSocket() client: SocketWithSession,
    @MessageBody()
    body: {
      chatId: string
      text?: string
      attachments?: Array<{
        name?: string
        mimeType?: string
        dataBase64: string
        size?: number
      }>
    },
  ) {
    const userId = client.request.session?.userId
    if (!userId) return { ok: false }

    const msg = await this.chatService.createMessage(userId, body.chatId, body.text)
    this.server.to(body.chatId).emit('message:new', msg)

    const memberIds = await this.chatService.getChatMemberIds(body.chatId)
    for (const memberId of memberIds) {
      if (memberId !== userId) {
        this.server.to(`user:${memberId}`).emit('chat:newMessage', { chatId: body.chatId, message: msg })
      }
    }

    return { ok: true, message: msg }
  }
}

